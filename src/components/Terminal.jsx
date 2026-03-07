import { useState, useEffect, useRef, useCallback } from "react";
import { PERSONAL, ABOUT, SKILLS, EXPERIENCE, PROJECTS, EDUCATION } from "../data/content";
import "./Terminal.css";

// ─── Rich Text Helpers ───────────────────────────────────────────────────────

const EASTER_KEYWORDS = ["basketball", "chess", "Minecraft", "cuisine"];
const EASTER_REGEX = new RegExp(`(${EASTER_KEYWORDS.join("|")})`);

function parseRichLine(text) {
  const parts = text.split(EASTER_REGEX).filter((p) => p !== "");
  if (parts.length === 1 && !EASTER_KEYWORDS.includes(parts[0])) return null;
  return parts.map((part) => ({
    text: part,
    ...(EASTER_KEYWORDS.includes(part) ? { easter: part.toLowerCase() } : {}),
  }));
}

// ─── Output Renderers ───────────────────────────────────────────────────────

function Line({ type = "text", children }) {
  return <div className={`line line--${type}`}>{children}</div>;
}

function Divider() {
  return <div className="line line--dim">{"─".repeat(50)}</div>;
}

function renderBanner() {
  return [
    { type: "ascii", text: "  __  __                           _  __  _" },
    { type: "ascii", text: " |  \\/  | ___   ___  ___  __ _   | |/ / | |__   __ _ _ __" },
    { type: "ascii", text: " | |\\/| |/ _ \\ / _ \\/ __|/ _` |  | ' /  | '_ \\ / _` | '_ \\" },
    { type: "ascii", text: " | |  | | (_) | (_) \\__ \\ (_| |  | . \\  | | | | (_| | | | |" },
    { type: "ascii", text: " |_|  |_|\\___/ \\___/|___/\\__,_|  |_|\\_\\ |_| |_|\\__,_|_| |_|" },
    { type: "dim",   text: "" },
    { type: "cyan",  text: " Software Engineering @ University of Waterloo" },
    { type: "dim",   text: " Waterloo, ON  ·  contact.moosakhan@gmail.com" },
    { type: "dim",   text: "" },
    { type: "text",  text: " Type 'help' to see available commands." },
  ];
}

function renderHelp(isLight = false) {
  return [
    { type: "cyan",  text: "Available commands:" },
    { type: "dim",   text: "" },
    { type: "cmd-hint", cmd: "about",      desc: "A little about me" },
    { type: "cmd-hint", cmd: "skills",     desc: "Technical skill set" },
    { type: "cmd-hint", cmd: "experience", desc: "Work experience" },
    { type: "cmd-hint", cmd: "projects",   desc: "Things I've built" },
    { type: "cmd-hint", cmd: "education",  desc: "Academic background" },
    { type: "cmd-hint", cmd: "contact",    desc: "How to reach me" },
    { type: "cmd-hint", cmd: "whoami",     desc: "Quick intro" },
    { type: "cmd-hint", cmd: "ls",         desc: "List directory" },
    { type: "cmd-hint", cmd: "clear",      desc: "Clear terminal" },
    isLight
      ? { type: "cmd-hint", cmd: "go-back",      desc: "return to dark mode" }
      : { type: "cmd-hint", cmd: "do-not-click", desc: "⚠  do not click this" },
    { type: "dim",   text: "" },
    { type: "dim",   text: "Tip: Click any command above to run it." },
  ];
}

function renderAbout() {
  const output = [
    { type: "cyan", text: "── about ──────────────────────────────────────" },
    { type: "dim",  text: "" },
  ];
  for (const line of ABOUT) {
    if (line === "") {
      output.push({ type: "dim", text: "" });
    } else {
      const segments = parseRichLine(line);
      if (segments) {
        output.push({ type: "rich", segments });
      } else {
        output.push({ type: "text", text: line });
      }
    }
  }
  return output;
}

function renderSkills() {
  const output = [
    { type: "cyan", text: "── skills ─────────────────────────────────────" },
  ];
  for (const [category, items] of Object.entries(SKILLS)) {
    output.push({ type: "dim",  text: "" });
    output.push({ type: "yellow", text: category });
    output.push({ type: "text",  text: items.join("  ·  ") });
  }
  return output;
}

function renderExperience() {
  const output = [
    { type: "cyan", text: "── experience ──────────────────────────────────" },
  ];
  for (const job of EXPERIENCE) {
    output.push({ type: "dim", text: "" });
    output.push({
      type: "yellow",
      text: job.title,
      extra: { period: job.period },
    });
    output.push({ type: "text", text: "  " + job.company });
    if (job.links?.length) {
      output.push({ type: "links", links: job.links });
    }
    for (const b of job.bullets) {
      output.push({ type: "bullet", text: b });
    }
  }
  return output;
}

function renderProjects() {
  const output = [
    { type: "cyan", text: "── projects ────────────────────────────────────" },
  ];
  for (const proj of PROJECTS) {
    output.push({ type: "dim", text: "" });
    output.push({ type: "yellow", text: proj.name });
    if (proj.links?.length) {
      output.push({ type: "links", links: proj.links });
    }
    for (const b of proj.bullets) {
      output.push({ type: "bullet", text: b });
    }
  }
  return output;
}

function renderEducation() {
  const output = [
    { type: "cyan", text: "── education ───────────────────────────────────" },
  ];
  for (const ed of EDUCATION) {
    output.push({ type: "dim", text: "" });
    output.push({ type: "yellow", text: ed.degree });
    output.push({ type: "text",   text: "  " + ed.school + "  ·  " + ed.location });
    output.push({ type: "text",   text: "  " + ed.period });
    if (ed.note) output.push({ type: "dim", text: "  " + ed.note });
    if (ed.bullets?.length) {
      for (const b of ed.bullets) {
        output.push({ type: "bullet", text: b });
      }
    }
  }
  return output;
}

function renderContact() {
  return [
    { type: "cyan", text: "── contact ─────────────────────────────────────" },
    { type: "dim",  text: "" },
    { type: "text", text: "  Email     ", link: { label: PERSONAL.email,    url: "mailto:" + PERSONAL.email } },
    { type: "text", text: "  LinkedIn  ", link: { label: "linkedin.com/in/moosa-khan-91488b25b", url: PERSONAL.linkedin } },
    { type: "text", text: "  GitHub    ", link: { label: "github.com/moosakhan",                  url: PERSONAL.github } },
  ];
}

function renderWhoami() {
  return [
    { type: "text",   text: "moosa khan" },
    { type: "dim",    text: "software engineering student @ university of waterloo" },
    { type: "dim",    text: "builder · researcher · occasional chef · chess middler" },
    { type: "dim",    text: "" },
    { type: "green",  text: "open to summer 2026 internships" },
  ];
}

function renderLs() {
  return [
    { type: "cyan",  text: "drwxr-xr-x  about/" },
    { type: "cyan",  text: "drwxr-xr-x  skills/" },
    { type: "cyan",  text: "drwxr-xr-x  experience/" },
    { type: "cyan",  text: "drwxr-xr-x  projects/" },
    { type: "cyan",  text: "drwxr-xr-x  education/" },
    { type: "text",  text: "-rw-r--r--  contact.txt" },
    { type: "text",  text: "-rw-r--r--  resume.pdf" },
  ];
}

// ─── Easter Eggs ─────────────────────────────────────────────────────────────

function renderSudo(args) {
  if (args.includes("rm")) {
    return [{ type: "error", text: "Nice try. rm -rf / is not in the internship description." }];
  }
  return [{ type: "error", text: "Permission denied. You are not in the sudoers file. This incident will not be reported." }];
}

function renderDate() {
  const now = new Date();
  return [{ type: "text", text: now.toDateString() + " " + now.toLocaleTimeString() }];
}

function renderPwd() {
  return [{ type: "text", text: "/home/moosa/portfolio" }];
}

function renderUname() {
  return [{ type: "text", text: "Darwin portfolio-v1.0 24.0.0 RELEASE arm64 — powered by caffeine and curiosity" }];
}

function renderPing() {
  return [
    { type: "text",  text: "PING google.com (142.250.80.46): 56 data bytes" },
    { type: "green", text: "64 bytes from 142.250.80.46: icmp_seq=0 ttl=116 time=9.2 ms" },
    { type: "green", text: "64 bytes from 142.250.80.46: icmp_seq=1 ttl=116 time=8.8 ms" },
    { type: "green", text: "64 bytes from 142.250.80.46: icmp_seq=2 ttl=116 time=10.1 ms" },
    { type: "dim",   text: "^C" },
    { type: "text",  text: "--- google.com ping statistics ---" },
    { type: "text",  text: "3 packets transmitted, 3 received, 0% packet loss" },
  ];
}

function renderCoffee() {
  return [
    { type: "yellow", text: "     ( (" },
    { type: "yellow", text: "      ) )" },
    { type: "yellow", text: "    ......." },
    { type: "yellow", text: "    |     |]" },
    { type: "yellow", text: "    \\     /" },
    { type: "yellow", text: "     `---'" },
    { type: "dim",    text: "" },
    { type: "text",   text: "  Fuel loaded. Ready to ship." },
  ];
}

function renderVim() {
  return [
    { type: "dim",   text: "" },
    { type: "text",  text: '~' },
    { type: "text",  text: '~' },
    { type: "text",  text: '~' },
    { type: "yellow",text: '"portfolio.txt" [readonly]' },
    { type: "dim",   text: "" },
    { type: "error", text: "You're trapped. Type  :q!  to escape (just kidding, this is a terminal)." },
  ];
}

function renderDoNotClick(isCurrentlyLight) {
  if (!isCurrentlyLight) {
    return [
      { type: "error",  text: "⚠  you were explicitly warned." },
      { type: "dim",    text: "" },
      { type: "yellow", text: "initiating eye-searing light mode..." },
      { type: "dim",    text: "" },
      { type: "dim",    text: "type 'do-not-click' again to return to the dark side." },
    ];
  }
  return [
    { type: "green", text: "ahh. much better." },
    { type: "dim",   text: "darkness restored. as it should be." },
  ];
}

function renderHello() {
  return [
    { type: "green", text: "Hey! 👋  Welcome to my portfolio." },
    { type: "dim",   text: "Type 'help' to see what you can do." },
  ];
}

function renderCatResume() {
  return [
    { type: "cyan",   text: "── resume.pdf ──────────────────────────────────" },
    { type: "yellow", text: "  MOOSA KHAN" },
    { type: "dim",    text: "  contact.moosakhan@gmail.com  ·  linkedin  ·  github" },
    { type: "dim",    text: "" },
    { type: "text",   text: "  SE @ UWaterloo · Python · C/C++ · JS · React · Flask" },
    { type: "text",   text: "  AI research · Embedded systems · Full-stack web dev" },
    { type: "dim",    text: "" },
    { type: "dim",    text: "  (Use the commands above for the full breakdown.)" },
  ];
}

function renderMatrix() {
  return [{ type: "matrix", text: "MATRIX" }];
}

// ─── Command Router ───────────────────────────────────────────────────────────

function runCommand(raw, isLight = false) {
  const trimmed = raw.trim().toLowerCase();
  const parts = trimmed.split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  switch (cmd) {
    case "help":       return { lines: renderHelp(isLight), clear: false };
    case "about":      return { lines: renderAbout(),      clear: false };
    case "skills":     return { lines: renderSkills(),     clear: false };
    case "experience": return { lines: renderExperience(), clear: false };
    case "projects":   return { lines: renderProjects(),   clear: false };
    case "education":  return { lines: renderEducation(),  clear: false };
    case "contact":    return { lines: renderContact(),    clear: false };
    case "whoami":     return { lines: renderWhoami(),     clear: false };
    case "ls":         return { lines: renderLs(),         clear: false };
    case "banner":     return { lines: renderBanner(),     clear: false };
    case "clear":          return { lines: [],                          clear: true  };
    case "do-not-click":
      if (isLight) return { lines: renderDoNotClick(true),  theme: true,  clear: false };
      return             { lines: renderDoNotClick(false), theme: true,  clear: false };
    case "go-back":
      if (isLight) return { lines: renderDoNotClick(true),  theme: true,  clear: false };
      return             { lines: [{ type: "dim", text: "you're already in the dark." }], clear: false };
    case "sudo":       return { lines: renderSudo(args),   clear: false };
    case "date":       return { lines: renderDate(),       clear: false };
    case "pwd":        return { lines: renderPwd(),        clear: false };
    case "uname":      return { lines: renderUname(),      clear: false };
    case "ping":       return { lines: renderPing(),       clear: false };
    case "coffee":     return { lines: renderCoffee(),     clear: false };
    case "vim":
    case "nano":       return { lines: renderVim(),        clear: false };
    case "hello":
    case "hi":         return { lines: renderHello(),      clear: false };
    case "matrix":     return { lines: renderMatrix(),     clear: false };
    case "cat":
      if (args[0] === "resume.pdf") return { lines: renderCatResume(), clear: false };
      return { lines: [{ type: "error", text: `cat: ${args[0] ?? ""}: No such file or directory` }], clear: false };
    case "":
      return null;
    default:
      return {
        lines: [{ type: "error", text: `command not found: ${cmd}` }],
        clear: false,
      };
  }
}

// ─── Output Line Component ────────────────────────────────────────────────────

function OutputLine({ item, onCommand, lightMode }) {
  if (item.type === "cmd-hint") {
    const isThemeToggle = item.cmd === "do-not-click" || item.cmd === "go-back";
    const cmd  = isThemeToggle ? (lightMode ? "go-back"             : "do-not-click")    : item.cmd;
    const desc = isThemeToggle ? (lightMode ? "return to dark mode" : "⚠  do not click this") : item.desc;
    return (
      <div className="line line--text">
        <button className="cmd-btn" onClick={() => onCommand(cmd)}>
          {cmd}
        </button>
        <span className="line--dim">{"  —  " + desc}</span>
      </div>
    );
  }

  if (item.type === "links") {
    return (
      <div className="line line--text" style={{ paddingLeft: "1.5rem" }}>
        {item.links.map((l, i) => (
          <a key={i} href={l.url} target="_blank" rel="noreferrer" className="terminal-link">
            [{l.label}]
          </a>
        ))}
      </div>
    );
  }

  if (item.type === "bullet") {
    return (
      <div className="line line--text" style={{ paddingLeft: "1.5rem" }}>
        <span className="line--dim">▸ </span>
        {item.text}
      </div>
    );
  }

  if (item.type === "yellow" && item.extra?.period) {
    return (
      <div className="line line--yellow" style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{item.text}</span>
        <span className="line--dim" style={{ fontSize: "0.85em" }}>{item.extra.period}</span>
      </div>
    );
  }

  if (item.link) {
    return (
      <div className={`line line--${item.type}`}>
        {item.text}
        <a href={item.link.url} target="_blank" rel="noreferrer" className="terminal-link">
          {item.link.label}
        </a>
      </div>
    );
  }

  if (item.type === "rich") {
    return (
      <div className="line line--text">
        {item.segments.map((seg, i) =>
          seg.easter ? (
            <span key={i} className={`easter-word easter-${seg.easter}`}>{seg.text}</span>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>
    );
  }

  if (item.type === "matrix") {
    return <MatrixLine />;
  }

  return <div className={`line line--${item.type}`}>{item.text}</div>;
}

function MatrixLine() {
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [text, setText] = useState("");

  useEffect(() => {
    let count = 0;
    const id = setInterval(() => {
      setText(
        Array.from({ length: 60 }, () => chars[Math.floor(Math.random() * chars.length)]).join(" ")
      );
      count++;
      if (count > 20) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, []);

  return <div className="line line--green matrix-line">{text}</div>;
}

// ─── History Entry ────────────────────────────────────────────────────────────

function HistoryEntry({ entry, onCommand, lightMode }) {
  return (
    <div className="history-entry">
      <div className="line line--prompt">
        <span className="prompt">moosa@portfolio:~$</span>
        <span className="line--green"> {entry.cmd}</span>
      </div>
      {entry.output.map((item, i) => (
        <OutputLine key={i} item={item} onCommand={onCommand} lightMode={lightMode} />
      ))}
    </div>
  );
}

// ─── Main Terminal ────────────────────────────────────────────────────────────

function makeInitialHistory(isLight = false) {
  return [
    { cmd: "banner", output: renderBanner() },
    { cmd: "help",   output: renderHelp(isLight) },
  ];
}

export default function Terminal({ visible, lightMode = false, onToggleTheme }) {
  const [history, setHistory] = useState(() => makeInitialHistory(false));
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const lightModeRef = useRef(lightMode);

  useEffect(() => { lightModeRef.current = lightMode; }, [lightMode]);

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  useEffect(() => {
    if (visible) setTimeout(focusInput, 100);
  }, [visible, focusInput]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const submit = useCallback(
    (raw) => {
      const result = runCommand(raw, lightModeRef.current);
      if (result === null) return;

      setCmdHistory((prev) => [raw, ...prev]);
      setHistIdx(-1);

      if (result.theme) {
        onToggleTheme?.();
      }

      if (result.clear) {
        setHistory(makeInitialHistory(lightModeRef.current));
      } else {
        setHistory((prev) => [...prev, { cmd: raw, output: result.lines }]);
      }
    },
    [onToggleTheme]
  );

  const handleKey = (e) => {
    if (e.key === "Enter") {
      submit(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : cmdHistory[next]);
    }
  };

  const handleClickCommand = useCallback(
    (cmd) => {
      submit(cmd);
      focusInput();
    },
    [submit, focusInput]
  );

  return (
    <div
      className={`terminal ${visible ? "terminal--visible" : ""}`}
      onClick={focusInput}
    >
      <div className="terminal__header">
        <div className="terminal__dots">
          <span className="dot dot--red" />
          <span className="dot dot--yellow" />
          <span className="dot dot--green" />
        </div>
        <span className="terminal__title">moosa@portfolio:~</span>
      </div>

      <div className="terminal__body">
        {history.map((entry, i) => (
          <HistoryEntry key={i} entry={entry} onCommand={handleClickCommand} lightMode={lightMode} />
        ))}

        {/* Active input line */}
        <div className="line line--prompt input-line">
          <span className="prompt">moosa@portfolio:~$</span>
          <span className="line--green"> </span>
          <input
            ref={inputRef}
            className="terminal__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
