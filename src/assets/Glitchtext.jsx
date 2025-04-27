import React, { useState, useEffect } from "react";

export default function GlitchText({ text }) {
  const [isGlitching, setIsGlitching] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching((prev) => !prev);
    }, 3000); // Toggle glitch every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={isGlitching ? "glitch-text" : ""}>
      {text}
    </span>
  );
}