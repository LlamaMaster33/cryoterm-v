/* index.css */
@import "@fontsource/vt323";

body {
  margin: 0;
  background: black;
  color: #7FE8FA;
  font-family: 'VT323', monospace;
  font-size: 18px;
  line-height: 1.6;
  user-select: none;
  overflow: hidden;
}

.crt {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: black;
  color: #7FE8FA;
  text-shadow: 0 0 2px #7FE8FA, 0 0 10px rgba(127, 232, 250, 0.4);
  padding: 2rem;
}

.crt::before {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  background: repeating-linear-gradient(
    transparent,
    rgba(255, 255, 255, 0.03) 1px,
    transparent 2px
  );
  mix-blend-mode: overlay;
  z-index: 1;
}