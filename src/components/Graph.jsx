// Graph.jsx
import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";

/* ----------------------------- Dossier Nodes ----------------------------- */
const nodes = [
  // Root Node
  { id: "Ghostpaw - Central Archive", label: "Ghostpaw - Central Archive", color: { background: "#1a1a2e" } },

  /* ------------------------- Cryo-Chamber Grid ------------------------- */
  { id: "Cryo-Chamber Grid", label: "Cryo-Chamber Grid", color: { background: "#123456" } }, // Folder
  { id: "LUSTRA_CHEM-USE_LOG_77B-A", label: "LUSTRA_CHEM-USE_LOG_77B-A" }, // File
  { id: "BASE_ICEHALLOW_003C", label: "BASE_ICEHALLOW_003C" }, // File
  { id: "CYANOR_LUA_RELIGION_DOSSIER_01", label: "CYANOR_LUA_RELIGION_DOSSIER_01" }, // File

  /* ------------------------- Dossier Compilation ------------------------- */
  { id: "Dossier Compilation", label: "Dossier Compilation", color: { background: "#2a2a2a" } }, // Folder
  { id: "DIREWOLF_RESCUE-DOC_78A", label: "DIREWOLF_RESCUE-DOC_78A" }, // File
  { id: "SIRO_0051-AUDIO-REV3", label: "SIRO_0051-AUDIO-REV3" }, // File
  { id: "TAPE_ERZA_XX17", label: "TAPE_ERZA_XX17" }, // File
  { id: "OMPF_GHOSTPAW_001A", label: "OMPF_GHOSTPAW_001A" }, // File
  { id: "OMPF_ERZA_002B", label: "OMPF_ERZA_002B" }, // File
  { id: "COMP_DIREWOLF_114X", label: "COMP_DIREWOLF_114X" }, // File
  { id: "CRX7_NOCTIS-DOSSIER_044V", label: "CRX7_NOCTIS-DOSSIER_044V" }, // File

  /* ------------------------- Voice Log Archive ------------------------- */
  { id: "VOICE LOG ARCHIVE", label: "VOICE LOG ARCHIVE", color: { background: "#1c1c3c" } }, // Folder
  { id: "VOICE_S13-ENTRY_01A", label: "VOICE_S13-ENTRY_01A" }, // File
  { id: "TAPE_02.LOG", label: "TAPE_02.LOG" }, // File

  /* ------------------------- Echo Signal Frequencies ------------------------- */
  { id: "Echo Signal Array", label: "Echo Signal Array", color: { background: "#0f1a2d" } }, // Display Node
  { id: "Frequency 128.3", label: "Frequency 128.3", x: 1000, y: -250 }, // Folder
  { id: "Frequency 113.7", label: "Frequency 113.7", x: 1000, y: -100 }, // Folder
  { id: "Frequency Void.Null", label: "Frequency Void.Null", x: 1000, y: 0 }, // Folder
  { id: "Frequency 666.0", label: "Frequency 666.0", x: 1000, y: 100 }, // Folder
];

/* ----------------------------- Dossier Edges ----------------------------- */
const edges = [
  // Root Node Connections
  { from: "Ghostpaw - Central Archive", to: "Cryo-Chamber Grid" },
  { from: "Ghostpaw - Central Archive", to: "Dossier Compilation" },
  { from: "Ghostpaw - Central Archive", to: "VOICE LOG ARCHIVE" },
  { from: "Ghostpaw - Central Archive", to: "Echo Signal Array" },

  /* ------------------------- Cryo-Chamber Grid ------------------------- */
  { from: "Cryo-Chamber Grid", to: "LUSTRA_CHEM-USE_LOG_77B-A" },
  { from: "Cryo-Chamber Grid", to: "BASE_ICEHALLOW_003C" },
  { from: "Cryo-Chamber Grid", to: "CYANOR_LUA_RELIGION_DOSSIER_01" },

  /* ------------------------- Dossier Compilation ------------------------- */
  { from: "Dossier Compilation", to: "DIREWOLF_RESCUE-DOC_78A" },
  { from: "Dossier Compilation", to: "SIRO_0051-AUDIO-REV3" },
  { from: "Dossier Compilation", to: "TAPE_ERZA_XX17" },
  { from: "Dossier Compilation", to: "OMPF_GHOSTPAW_001A" },
  { from: "Dossier Compilation", to: "OMPF_ERZA_002B" },
  { from: "Dossier Compilation", to: "COMP_DIREWOLF_114X" },
  { from: "Dossier Compilation", to: "CRX7_NOCTIS-DOSSIER_044V" },

  /* ------------------------- Voice Log Archive ------------------------- */
  { from: "VOICE LOG ARCHIVE", to: "VOICE_S13-ENTRY_01A" },
  { from: "VOICE LOG ARCHIVE", to: "TAPE_02.LOG" },

  /* ------------------------- Echo Signal Frequencies ------------------------- */
  { from: "Echo Signal Array", to: "Frequency 128.3" },
  { from: "Echo Signal Array", to: "Frequency 113.7" },
  { from: "Echo Signal Array", to: "Frequency Void.Null" },
  { from: "Echo Signal Array", to: "Frequency 666.0" },
];

/* ----------------------------- Graph Component ----------------------------- */
export default function GraphView({ onNodeClick }) {
  const container = useRef(null);

  useEffect(() => {
    if (container.current) {
      const network = new Network(
        container.current,
        { nodes, edges },
        {
          nodes: {
            font: { color: "white", face: "VT323", size: 18 }, // Uniform font styling
            color: { background: "#111", border: "#88f" },
            borderWidth: 1,
            shape: "dot",
            size: 12, // Default size for nodes
          },
          edges: {
            color: "#555",
            smooth: {
              type: "dynamic", // Curvy edges
              roundness: 0.4, // Rounded edges
            },
          },
          layout: {
            improvedLayout: true, // Let physics handle layout
          },
          physics: {
            enabled: true,
            solver: "forceAtlas2Based", // Use force-based solver
            forceAtlas2Based: {
              gravitationalConstant: -50, // Adjust repulsion
              centralGravity: 0.005, // Pull nodes toward the center
              springLength: 100, // Distance between connected nodes
              springConstant: 0.08, // Spring stiffness
              damping: 0.6, // Reduce oscillations
              avoidOverlap: 0.8, // Prevent node overlap
            },
            stabilization: {
              enabled: true,
              iterations: 1500, // More iterations for better stabilization
              updateInterval: 100, // Update layout every 100 iterations
            },
          },
          interaction: {
            dragView: true,
            zoomView: true,
          },
        }
      );

      network.on("click", function (params) {
        if (params.nodes.length > 0) {
          const node = nodes.find((n) => n.id === params.nodes[0]);
          if (node && onNodeClick) onNodeClick(node.id);
        }
      });
    }
  }, [onNodeClick]);

  return (
    <div
      ref={container}
      className="graph-container"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    />
  );
}