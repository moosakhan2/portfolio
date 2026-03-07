import { useState, useEffect, useRef } from "react";

export function useTypewriter(text, speed = 60, startDelay = 0, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    setDisplayed("");
    setDone(false);

    let i = 0;
    const start = setTimeout(() => {
      const tick = () => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
          i++;
          timeoutRef.current = setTimeout(tick, speed);
        } else {
          setDone(true);
        }
      };
      tick();
    }, startDelay);

    return () => {
      clearTimeout(start);
      clearTimeout(timeoutRef.current);
    };
  }, [text, speed, startDelay, enabled]);

  return { displayed, done };
}
