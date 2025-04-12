import { useState, useEffect, useRef } from "react";
import { frequencyNodes, frequencyResponses } from "../commands/FrequencyResponses";
import { dossierNodes, dossierResponses } from "../commands/DossierResponses";
import Graph from './Graph';
import startupSound from "../assets/bootup.mp3";
import "../index.css";

const bootLines = [
  "CryoTerm-V [113th-C.L. - Clearance Level BLUE]",
  "Initializing system...",
  "Loading OS Kernel: █▒▒▒▒▒▒▒▒▒ 5%",
  "Loading OS Kernel: ██▒▒▒▒▒▒▒▒ 15%",
  "Loading OS Kernel: ███▒▒▒▒▒▒▒ 30%",
  "Loading OS Kernel: █████▒▒▒▒▒ 50%",
  "Loading OS Kernel: ███████▒▒▒ 70%",
  "Mounting Data Volume: ████████▒▒ 80%",
  "Mounting Data Volume: █████████▒ 90%",
  "Mounting Data Volume: ██████████ 100%",
  "Boot check complete.",
  "System integrity: OK",
  ">>> Type 'login' to begin authentication."
];

const loginCredentials = {
  "Ghostpaw": "ScrewtheSrs",
  "erza": "Warrior123",
  "1": "1",
};

const baseNodes = [
  { id: "Ghostpaw - Central Archive", label: "Ghostpaw - Central Archive" },
  { id: "Cryo-Chamber Grid", label: "Cryo-Chamber Grid" },
  { id: "Operative Ghostpaw (Primary File)", label: "Operative Ghostpaw (Primary File)" },
  { id: "Commander Ezra", label: "Commander Ezra" },
  { id: "Dossier Compilation", label: "Dossier Compilation" }, // New folder
  { id: "VOICE LOG ARCHIVE", label: "VOICE LOG ARCHIVE" } // New folder
];

const edges = [
  { from: "Ghostpaw - Central Archive", to: "Cryo-Chamber Grid" },
  { from: "Ghostpaw - Central Archive", to: "Dossier Compilation" },
  { from: "Dossier Compilation", to: "Operative Ghostpaw (Primary File)" },
  { from: "Dossier Compilation", to: "Commander Ezra" }
];

export default function Terminal() {
  const [output, setOutput] = useState([]);
  const [bootIndex, setBootIndex] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const [input, setInput] = useState("");
  const [loginStage, setLoginStage] = useState(null);
  const [tempUser, setTempUser] = useState("");
  const [graphVisible, setGraphVisible] = useState(false); // New state for graph visibility
  const [discoveredFrequencies, setDiscoveredFrequencies] = useState([]); // Track scanned frequencies
  const [openFolder, setOpenFolder] = useState(null); // Track the currently open folder
  
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
        behavior: 'smooth', // Smooth scrolling animation
      });
    }
  }, [output]); // Trigger auto-scroll whenever `output` changes
  
  useEffect(() => {
    const audio = new Audio(startupSound);
    audio.volume = 0.3;
    audio.play();

    const interval = setInterval(() => {
      if (bootIndex < bootLines.length) {
        setOutput((prev) => [...prev, bootLines[bootIndex]]);
        setBootIndex((i) => i + 1);
      } else {
        setBootComplete(true);
        clearInterval(interval);
      }
    }, 4); // 400ms per line = ~3 seconds boot
    return () => clearInterval(interval);
  }, [bootIndex]);

  const handleInput = (e) => {
    if (e.key === "Enter") {
      const userInput = input.trim().toLowerCase();

      if (userInput === "graph") {
        setGraphVisible((prevState) => !prevState); // Toggle graph visibility
        setOutput((prev) => [...prev, ">>> Toggling graph view..."]);
      } else {
        processCommand(userInput);
      }

      setInput(""); // Clear input field
    }
  };

  const processCommand = (cmd) => {
    const lower = cmd.toLowerCase();
    let newLines = [];
  
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
        const validFolders = ["Cryo-Chamber Grid", "Dossier Compilation", "VOICE LOG ARCHIVE"];
        const matchedFolder = validFolders.find((folder) => folder.toLowerCase() === folderName.toLowerCase());
      
        if (matchedFolder) {
          setOpenFolder(matchedFolder);
          console.log(`Folder opened: ${matchedFolder}`); // Debug log
          newLines.push(`>>> Folder '${matchedFolder}' opened.`);
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
          if (frequencyNodes[frequency] && !discoveredFrequencies.includes(frequency)) {
            setDiscoveredFrequencies((prev) => [...prev, frequency]);
            newLines.push(...(frequencyResponses[frequency] || [`>>> Frequency ${frequency} not found.`]));
          } else if (discoveredFrequencies.includes(frequency)) {
            newLines.push(`>>> Frequency ${frequency} already scanned.`);
          } else {
            newLines.push(`>>> Frequency ${frequency} not found.`);
          }
      } else if (lower === "logout") {
        newLines.push(">>> Logging out...");
        setLoginStage(null);
        setInput("");
        newLines.push(">>> Authentication reset.");
        newLines.push(">>> Type 'login' to begin authentication.");
      } else if (lower === "graph") { // Handle the graph command here
        setGraphVisible((prevState) => !prevState); // Toggle graph visibility
        newLines.push(">>> Toggling graph view...");
      } else {
        switch (lower) {
          case "help":
            newLines.push("Available Commands:");
            newLines.push("- folder <folder name>");
            newLines.push("- dossier <dossier name>");
            newLines.push("- graph");
            newLines.push("- logout");
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
          newLines.push("Available Commands:");
          newLines.push("- folder <folder name>");
          newLines.push("- dossier <dossier name>");
          newLines.push("- graph");
          newLines.push("- logout");
        }
        break;
      default:
        newLines.push(`> ${cmd}`);
        newLines.push("Unknown command.");
    }
  
    setOutput([...output, ...newLines]);
  };

  return (
    <div className="crt" style={{ backgroundColor: "black" }}>
      {output.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      {graphVisible && <Graph nodes={nodes} edges={edges} />}
      {bootComplete && (
        <div style={{ display: "flex", alignItems: "center", backgroundColor: "black" }}>
          <span>
            {loginStage === "user" && ">>> USER: "}
            {loginStage === "pass" && ">>> PASS: "}
            {loginStage === "loggedIn" && "> "}
            {loginStage === null && "> "}
          </span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInput}
            style={{
              background: "transparent", // Make the background transparent
              border: "none",
              outline: "none",
              color: "#7FE8FA",
              fontFamily: "VT323, monospace",
              fontSize: "18px",
              caretColor: "#7FE8FA", // Ensure the caret matches the glowing text
              flex: 1,
            }}
          />
        </div>
      )}
    </div>
  );
}