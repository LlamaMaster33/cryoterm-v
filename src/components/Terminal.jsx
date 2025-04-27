//Terminal.jsx
import { useState, useEffect, useRef } from "react";

// Commands
import { frequencyNodes, frequencyResponses } from "../commands/FrequencyResponses";
import { dossierNodes, dossierResponses } from "../commands/DossierResponses";
import { loginCredentials, helpResponses } from "../commands/MiscCommands";

// Components
import Graph from './Graph';
import GlitchText from "../assets/Glitchtext";

// Assets
import startupSound from "../assets/bootup.mp3";
import shutdownSound from "../assets/shutdown.mp3";

// Styles
import "../index.css";

/* ----------------------------- Boot Lines ----------------------------- */
const bootLines = [
  "(C) 2043 CryoTerm-V [113th-CryoLegion]",
  "Kernal: CryoTerm-V 2.0.1 on an ARM Cortex-A53 (64-bit)",
  "Booting from Hard Drive...",
  "Using Drive 3. partition 1.",
  "\n",
  "Initializing system...",
  "Loading OS Kernel:    [█▒▒▒▒▒▒▒▒▒] 5%",
  "Loading OS Kernel:    [██▒▒▒▒▒▒▒▒] 15%",
  "Loading OS Kernel:    [███▒▒▒▒▒▒▒] 30%",
  "Loading OS Kernel:    [█████▒▒▒▒▒] 50%",
  "Loading OS Kernel:    [███████▒▒▒] 70%",
  "Mounting Data Volume: [████████▒▒] 80%",
  "Mounting Data Volume: [█████████▒] 90%",
  "Mounting Data Volume: [██████████] 100%",
  "Boot check complete.",
  "System integrity: OK",
  ">>> Type 'login' to begin authentication."
];

/* ----------------------------- Logout Lines ----------------------------- */
const logoutLines = [
  "(C) 2043 CryoTerm-V",
  ">>> Logging out...",
  ">>> Authentication reset.",
  ">>> Type 'login' to begin authentication."
];

/* ----------------------------- Base Nodes ----------------------------- */
const baseNodes = [
  { id: "Ghostpaw - Central Archive", label: "Ghostpaw - Central Archive" },
  { id: "Cryo-Chamber Grid", label: "Cryo-Chamber Grid" },
  { id: "Operative Ghostpaw (Primary File)", label: "Operative Ghostpaw (Primary File)" },
  { id: "Commander Ezra", label: "Commander Ezra" },
  { id: "Dossier Compilation", label: "Dossier Compilation" }, // New folder
  { id: "VOICE LOG ARCHIVE", label: "VOICE LOG ARCHIVE" }, // New folder
  { id: "Frequency 666.0", label: "Frequency 666.0" } // New folder
];

/* ----------------------------- Graph Edges ----------------------------- */
const edges = [
  { from: "Ghostpaw - Central Archive", to: "Cryo-Chamber Grid" },
  { from: "Ghostpaw - Central Archive", to: "Dossier Compilation" },
  { from: "Dossier Compilation", to: "Operative Ghostpaw (Primary File)" },
  { from: "Dossier Compilation", to: "Commander Ezra" }
];

/* ----------------------------- Terminal Component ----------------------------- */
export default function Terminal() {
  // State variables
  const [output, setOutput] = useState([]);
  const [bootIndex, setBootIndex] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const [input, setInput] = useState("");
  const [loginStage, setLoginStage] = useState(null);
  const [tempUser, setTempUser] = useState("");
  const [isTypingDisabled, setIsTypingDisabled] = useState(false); // Disable typing state
  const [graphVisible, setGraphVisible] = useState(false); // New state for graph visibility
  const [discoveredFrequencies, setDiscoveredFrequencies] = useState([]); // Track scanned frequencies
  const [openFolder, setOpenFolder] = useState(null); // Track the currently open folder
  const [scannedFolders, setScannedFolders] = useState([]); // Track scanned folders
  const [commandHistory, setCommandHistory] = useState([]); // Store past commands
  const [historyIndex, setHistoryIndex] = useState(-1); // Track the current position in history

  // Refs
  const inputRef = useRef(null); // Create a ref for the input field
  const terminalRef = useRef(null); // Ref for terminal div

  const nodes = [
    ...baseNodes,
    ...discoveredFrequencies.map((freq) => frequencyNodes[freq]),
    ...Object.values(dossierNodes) // Include dossier nodes in the graph
  ];

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTo({
        top: terminalRef.current.scrollHeight,
        behavior: 'smooth !important', // Smooth scrolling animation
      });
    }
  }, [output]); // Trigger auto-scroll whenever `output` changes

  useEffect(() => {
    const audio = new Audio(startupSound);
    audio.volume = 0.3;
    audio.play();
  }, []); // Play sound on component mount

  useEffect(() => {
    const interval = setInterval(() => {
      if (bootIndex < bootLines.length) {
        setOutput((prev) => [...prev, bootLines[bootIndex]]);
        setBootIndex((i) => i + 1);
      } else {
        setBootComplete(true);
        clearInterval(interval);
      }
    }, 400); // 400ms per line = ~3 seconds boot
    return () => clearInterval(interval);
  }, [bootIndex]);

  const handleInput = (e) => {
    if (e.key === "Enter") {
      const userInput = input.trim();
      if (userInput) {
        setCommandHistory((prev) => [...prev, userInput]); // Add command to history
        setHistoryIndex(-1); // Reset history index
        processCommand(userInput);
      }
      setInput(""); // Clear input field
    } else if (e.key === "ArrowUp") {
      // Navigate up in history
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]); // Get the command from history
      }
    } else if (e.key === "ArrowDown") {
      // Navigate down in history
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]); // Get the command from history
      } else {
        setHistoryIndex(-1);
        setInput(""); // Clear input if at the bottom of history
      }
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Programmatically focus the input field
    }
  };

  const processCommand = (cmd) => {
    const lower = cmd.toLowerCase();
    let newLines = [];
    setOutput((prev) => [...prev, `> ${cmd}`, "Command executed."]);
  
    if (loginStage === "user") {
      setTempUser(lower); // Store the username in lowercase
      newLines.push(`>>> USER: ${cmd}`);
      setLoginStage("pass");
      setOutput([...output, ...newLines]);
      return;
    } else if (loginStage === "pass") {
      newLines.push(`>>> PASS: ${"•".repeat(cmd.length)}`);
      // Compare username and password in a case-insensitive manner
      const normalizedUser = Object.keys(loginCredentials).find(
        (key) => key.toLowerCase() === tempUser
      );
      if (normalizedUser && loginCredentials[normalizedUser].toLowerCase() === cmd.toLowerCase()) {
        setLoginStage("loggedIn");
        newLines.push(">>> ACCESS GRANTED");
        newLines.push(">>> Welcome, Operative.");
        newLines.push(">>> Type 'help' for command list.");
      } else {
        newLines.push(">>> ACCESS DENIED");
        setLoginStage(null);
      }
      setOutput([...output, ...newLines]);
      return;
    } else if (loginStage === "loggedIn") {
      if (lower.startsWith("folder")) {
        const folderName = cmd.split(" ").slice(1).join(" ").trim(); // Extract folder name
        const scannedRequiredFolders = [
          "Frequency 128.3",
          "Frequency 147.9",
          "Frequency 666.0",
          "Frequency Void.Null"
        ]; // Folders that require scanning
        const nonScannedFolders = [
          "Cryo-Chamber Grid",
          "Dossier Compilation",
          "VOICE LOG ARCHIVE"
        ]; // Folders that don't require scanning
      
        const validFolders = [...scannedRequiredFolders, ...nonScannedFolders]; // Combine all valid folders
        console.log(`Extracted folder name: ${folderName}`); // Debug log
        const matchedFolder = validFolders.find((folder) => folder.toLowerCase() === folderName.toLowerCase());
      
        if (matchedFolder) {
          if (scannedRequiredFolders.includes(matchedFolder)) {
            // Check if the folder requires scanning
            if (scannedFolders.includes(matchedFolder)) {
              setOpenFolder(matchedFolder);
              console.log(`Folder opened: ${matchedFolder}`); // Debug log
              newLines.push(`>>> Folder '${matchedFolder}' opened.`);
            } else {
              newLines.push(`>>> You must scan the corresponding frequency to access '${matchedFolder}'.`);
            }
          } else {
            // Non-scanned folders can be opened directly
            setOpenFolder(matchedFolder);
            console.log(`Folder opened: ${matchedFolder}`); // Debug log
            newLines.push(`>>> Folder '${matchedFolder}' opened.`);
          }
        } else {
          console.log(`Folder not found: ${folderName}`); // Debug log
          newLines.push(`>>> Folder '${folderName}' not found.`);
        }
      } else if (lower.startsWith("dossier")) {
        const parts = cmd.split(" ");
        const dossierName = parts.length > 1 ? parts.slice(1).join(" ").trim() : null; // Extract dossier name
        console.log(`Extracted dossier name: ${dossierName}`); // Debug log
        console.log(`Current open folder: ${openFolder}`); // Debug log
      
        // Find the dossier in a case-insensitive manner
        const matchedDossier = Object.keys(dossierNodes).find(
          (key) => key.toLowerCase() === dossierName.toLowerCase()
        );
      
        if (matchedDossier) {
          const dossier = dossierNodes[matchedDossier];
          if (openFolder === dossier.folder) {
            newLines.push(...(dossierResponses[matchedDossier] || [`>>> Dossier '${dossierName}' not found.`]));
          } else {
            newLines.push(`>>> You must open the '${dossier.folder}' folder to access this dossier.`);
          }
        } else {
          newLines.push(`>>> Dossier '${dossierName}' not found.`);
        }
      } else if (lower.startsWith("scan")) {
        const frequency = lower.split(" ")[1];
        console.log(`Scanning frequency: ${frequency}`); // Debug log
        if (frequencyNodes[frequency] && !discoveredFrequencies.includes(frequency)) {
          setDiscoveredFrequencies((prev) => [...prev, frequency]);
          setScannedFolders((prev) => [...prev, `Frequency ${frequency}`]); // Mark folder as scanned
          newLines.push(...(frequencyResponses[frequency] || [`>>> Frequency ${frequency} not found.`]));
        } else if (discoveredFrequencies.includes(frequency)) {
          newLines.push(`>>> Frequency ${frequency} already scanned.`);
        } else {
          newLines.push(`>>> Frequency ${frequency} not found.`);
        }
      } else if (lower === "logout") {
        const audio = new Audio(shutdownSound); // Play the logout sound
        audio.volume = 0.3;
        audio.play();
      
        let logoutIndex = 0;
      
        const interval = setInterval(() => {
          if (logoutIndex < logoutLines.length) {
            setOutput((prev) => [...prev, logoutLines[logoutIndex]]);
            logoutIndex++;
          } else {
            clearInterval(interval); // Clear the interval when all lines are displayed
            setLoginStage(null); // Reset login stage after logout
      
            // Disable typing and clear the terminal after 8 seconds
            setIsTypingDisabled(true); // Disable typing
            setTimeout(() => {
              setOutput(["(C) 2043 CryoTerm-V [113th-C.L. - Clearance Level BLUE]\n>>> Type 'login' to begin authentication."]); // Display login message
              setIsTypingDisabled(false); // Re-enable typing
            }, 8000); // 8-second delay
          }
        }, 1200); // Adjust the interval time (1200ms per line)
      } else if (lower === "graph") { // Handle the graph command here
        setGraphVisible((prevState) => !prevState); // Toggle graph visibility
        newLines.push(">>> Toggling graph view...");
      } else {
        switch (lower) {
          case "help":
          if (loginStage !== "loggedIn") {
            newLines.push(">>> Authenticate first.");
          } else {
            newLines.push(...helpResponses);
          }
          break;
          default:
            newLines.push(`> ${cmd}`);
            newLines.push("Unknown command.");
        }
      }
      setOutput([...output, ...newLines]);
      return;
    }
  
    switch (lower) {
      case "login":
        if (loginStage === "loggedIn") {
          newLines.push(">>> Already logged in.");
        } else {
          setLoginStage("user");
        }
        break;
      case "help":
        if (loginStage !== "loggedIn") {
          newLines.push(">>> Authenticate first.");
        } else {
          newLines.push(...helpResponses);
        }
        break;
      default:
        newLines.push(`> ${cmd}`);
        newLines.push("Unknown command.");
    }
  
    setOutput([...output, ...newLines]);
  };

  return (
  <div class="crt-plastic">
    <div className="crt" onClick={handleTerminalClick}>
      {output.map((line, i) => (
        <div key={i}>
          {typeof line === "string" ? line : <GlitchText text={line} />}
        </div>
      ))}
      {graphVisible && (
        <div className="graph-popout">
          <button
            className="close-button"
            onClick={() => setGraphVisible(false)} // Close the graph view
          >
            ✕
          </button>
          <Graph nodes={nodes} edges={edges} />
        </div>
      )}
      {bootComplete && (
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "transparent" }}>
          <span>
            {loginStage === "user" && ">>> USER: "}
            {loginStage === "pass" && ">>> PASS: "}
            {loginStage === "loggedIn" && "> "}
            {loginStage === null && "> "}
          </span>
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInput}
            disabled={isTypingDisabled} // Disable input when typing is not allowed
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#7FE8FA",
              fontFamily: "VT323, monospace",
              fontSize: "18px",
              caretColor: "#7FE8FA",
              flex: 1,
              opacity: isTypingDisabled ? 0.5 : 1, // Dim the input field when disabled
              cursor: isTypingDisabled ? "not-allowed" : "text", // Change cursor when disabled
            }}
          />
        </div>
      )}
    </div>
  </div>
  );
}