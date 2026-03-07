import { useState, useEffect, useRef } from "react";
import "./SplashScreen.css";

const NAME = "Moosa Khan";
const SUBTITLE = "UWaterloo SE '30";

export default function SplashScreen({ onComplete }) {
  const [phase, setPhase] = useState("name"); // name | subtitle | hold | fade
  const [nameText, setNameText] = useState("");
  const [subtitleText, setSubtitleText] = useState("");
  const [glitch, setGlitch] = useState(false);
  const rafRef = useRef(null);

  // Type name
  useEffect(() => {
    if (phase !== "name") return;
    let i = 0;
    const tick = () => {
      i++;
      setNameText(NAME.slice(0, i));
      if (i < NAME.length) {
        rafRef.current = setTimeout(tick, 80);
      } else {
        // glitch briefly then move to subtitle
        setGlitch(true);
        setTimeout(() => setGlitch(false), 400);
        setTimeout(() => setPhase("subtitle"), 700);
      }
    };
    rafRef.current = setTimeout(tick, 300);
    return () => clearTimeout(rafRef.current);
  }, [phase]);

  // Type subtitle
  useEffect(() => {
    if (phase !== "subtitle") return;
    let i = 0;
    const tick = () => {
      i++;
      setSubtitleText(SUBTITLE.slice(0, i));
      if (i < SUBTITLE.length) {
        rafRef.current = setTimeout(tick, 70);
      } else {
        setTimeout(() => setPhase("hold"), 600);
      }
    };
    rafRef.current = setTimeout(tick, 100);
    return () => clearTimeout(rafRef.current);
  }, [phase]);

  // Hold then fade
  useEffect(() => {
    if (phase !== "hold") return;
    const t = setTimeout(() => setPhase("fade"), 900);
    return () => clearTimeout(t);
  }, [phase]);

  // After fade, notify parent
  useEffect(() => {
    if (phase !== "fade") return;
    const t = setTimeout(onComplete, 700);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  return (
    <div className={`splash ${phase === "fade" ? "splash--fade" : ""}`}>
      <div className="splash__content">
        <h1 className={`splash__name ${glitch ? "glitch" : ""}`} data-text={nameText}>
          {nameText}
          {(phase === "name") && <span className="splash__cursor">█</span>}
        </h1>
        {subtitleText && (
          <p className="splash__subtitle">
            {subtitleText}
            {phase === "subtitle" && <span className="splash__cursor">█</span>}
          </p>
        )}
      </div>
    </div>
  );
}
