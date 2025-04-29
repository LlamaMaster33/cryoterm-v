/* ----------------------------- Imports ----------------------------- */
import React, { useState } from "react";
import Terminal from "./components/Terminal";
import Graph from "./components/Graph";

/* ----------------------------- Constants ----------------------------- */
const MAX_LINES = 30;

/* ----------------------------- App Component ----------------------------- */
function App() {
  
  /* ----------------------------- State Variables ----------------------------- */
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [showGraph, setShowGraph] = useState(false);

  /* ----------------------------- Helper Functions ----------------------------- */
  const appendToTerminal = (text) => {
    setTerminalOutput((prev) => {
      const newOutput = [...prev, text];
      return newOutput.length > MAX_LINES
        ? newOutput.slice(newOutput.length - MAX_LINES)
        : newOutput;
    });
  };

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    appendToTerminal(`> ${trimmed}`);

    if (trimmed.toLowerCase() === ":graph") {
      setShowGraph((prev) => !prev);
      return;
    }

    appendToTerminal(`Running command: ${trimmed}`);
  };

  /* ----------------------------- Render ----------------------------- */
  return (
    <div style={{ height: "100vh", backgroundColor: "black", color: "white" }}>
      {/* ----------------------------- Terminal Section ----------------------------- */}
      <div
        style={{
          paddingRight: showGraph ? "28%" : 0,
          height: "100%",
          backgroundColor: "black",
        }}
      >
        <Terminal
          onCommand={handleCommand}
          terminalOutput={terminalOutput}
          appendToTerminal={appendToTerminal}
        />
      </div>

      {/* ----------------------------- Graph Section ----------------------------- */}
      {showGraph && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "28%", // roughly 9:16 ratio
            height: "100%",
            backgroundColor: "black",
            borderLeft: "1px solid #333",
            zIndex: 1000,
          }}
        >
          <Graph
            onNodeClick={(nodeId) => {
              appendToTerminal(`> ${nodeId}`);
              handleCommand(nodeId);
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Export ----------------------------- */
export default App;