import { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import Terminal from "./components/Terminal";

export default function App() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    document.body.style.background = lightMode ? "#f5f5f0" : "#0a0a0a";
  }, [lightMode]);

  return (
    <div className={lightMode ? "light-mode" : ""} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {!showTerminal && <SplashScreen onComplete={() => setShowTerminal(true)} />}
      <Terminal
        visible={showTerminal}
        lightMode={lightMode}
        onToggleTheme={() => setLightMode((l) => !l)}
      />
    </div>
  );
}
