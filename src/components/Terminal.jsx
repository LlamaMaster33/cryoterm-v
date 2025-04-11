import { useState, useEffect, useRef } from "react";
import { listReports, listDossier, openReport } from "../commands/ReportCommands";
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

const graph = {
  nodes: [
    { id: 'entry1', title: 'Entry 1', description: 'Details about Entry 1' },
    { id: 'entry2', title: 'Entry 2', description: 'Details about Entry 2' },
    { id: 'entry3', title: 'Entry 3', description: 'Details about Entry 3' }
  ],
  edges: [
    { from: 'entry1', to: 'entry2' },
    { from: 'entry2', to: 'entry3' }
  ]
};

export default function Terminal() {
  const [output, setOutput] = useState([]);
  const [bootIndex, setBootIndex] = useState(0);
  const [bootComplete, setBootComplete] = useState(false);
  const [input, setInput] = useState("");
  const [loginStage, setLoginStage] = useState(null);
  const [tempUser, setTempUser] = useState("");
  const [graphVisible, setGraphVisible] = useState(false); // New state for graph visibility
  const terminalRef = useRef(null); // Ref for terminal div

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
      if (lower === "logout") {
        newLines.push(">>> Logging out...");
        setLoginStage(null);
        setInput("");
        newLines.push(">>> Authentication reset.");
        newLines.push(">>> Type 'login' to begin authentication.");
      } else {
        switch (lower) {
            case "help":
            newLines.push("> Available Commands:");
            newLines.push("  - get reports");
            newLines.push("  - list dossiers");
            newLines.push("  - nav folder [folder name]");
            newLines.push("  - open dossier [report ID]");
            newLines.push("  - graph");
            newLines.push("  - logout");
            break;
          case "list reports":
            newLines.push("Pulling Reports...");
            newLines.push(...listReports());
            break;
          case "list dossiers":
            newLines.push("Pulling Dossier...");
            newLines.push(...listDossier());
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
          newLines.push("- list reports");
          newLines.push("- list documents");
          newLines.push("- graph");
          newLines.push("- logout");
        }
        break;
       case "list reports":
          if (loginStage !== "loggedIn") {
            newLines.push(">>> Authenticate first.");
          } else {
            newLines.push(...listReports());
          }
          break;
        case "open documents":
            if (loginStage !== "loggedIn") {
                newLines.push(">>> Authenticate first.");
            } else {
                const reportId = cmd.split(" ")[2]; // Extract report ID from command
                newLines.push(`>>> Opening report ${reportId}...`);
                // Call the function to open the report
                newLines.push(...openReport(reportId));
            }
            break;
      default:
        newLines.push(`> ${cmd}`);
        newLines.push("Unknown command.");
    }
  
    setOutput([...output, ...newLines]);
  };

  return (
    <div className="crt" style={{ backgroundColor: "black"}}>
      {output.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
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
              background: "black",
              backgroundColor: "black",
              border: "none",
              outline: "none",
              color: "#7FE8FA",
              fontFamily: "VT323, monospace",
              fontSize: "18px",
              flex: 1,
            }}
          />
        </div>
      )}
      {graphVisible && <Graph nodes={graph.nodes} edges={graph.edges} />} {/* Render Graph */}
    </div>
  );
}