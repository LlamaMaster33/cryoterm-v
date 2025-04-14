// GraphView.jsx
import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";

const nodes = [
  { id: "Ghostpaw - Central Archive", label: "Ghostpaw - Central Archive" }, // Root Node
  { id: "Cryo-Chamber Grid", label: "Cryo-Chamber Grid" }, // Folder
  { id: "Dossier Compilation", label: "Dossier Compilation" }, // Folder
  { id: "VOICE LOG ARCHIVE", label: "VOICE LOG ARCHIVE" }, // Folder
  // Echo Signal Frequencies (secret access)
  { id: "Frequency 128.3", label: "Frequency 128.3", x: 1000, y: -250 }, // Folder
  { id: "Frequency 113.7", label: "Frequency 113.7", x: 1000, y: -100 }, // Folder
  { id: "Frequency Void.Null", label: "Frequency Void.Null", x: 1000, y: 0 }, // Folder
  { id: "Frequency 666.0", label: "Frequency 666.0", x: 1000, y: 100 }, // Folder
  // Files
  { id: "LUSTRA_CHEM-USE_LOG_77B-A", label: "LUSTRA_CHEM-USE_LOG_77B-A" }, // File
  { id: "BASE_ICEHALLOW_003C", label: "BASE_ICEHALLOW_003C" }, // File
  { id: "DIREWOLF_RESCUE-DOC_78A", label: "DIREWOLF_RESCUE-DOC_78A" }, // File
  { id: "TAPE_ERZA_XX17", label: "TAPE_ERZA_XX17" }, // File
  { id: "OMPF_GHOSTPAW_001A", label: "OMPF_GHOSTPAW_001A" }, // File
  { id: "OMPF_ERZA_002B", label: "OMPF_ERZA_002B" }, // File
  { id: "COMP_DIREWOLF_114X", label: "COMP_DIREWOLF_114X" }, // File
  { id: "VOICE_S13-ENTRY_01A", label: "VOICE_S13-ENTRY_01A" }, // File
  { id: "TAPE_02.LOG", label: "TAPE_02.LOG" }, // File
  { id: "S13_INITIAL_RECOVERY-DOC_112F", label: "S13_INITIAL_RECOVERY-DOC_112F" }, // File
  // Display Nodes
  { id: "Echo Signal Array", label: "Echo Signal Array" }, // Display Node
];

const edges = [
  { from: "Ghostpaw - Central Archive", to: "Cryo-Chamber Grid" },
  { from: "Ghostpaw - Central Archive", to: "Dossier Compilation" },
  { from: "Ghostpaw - Central Archive", to: "VOICE LOG ARCHIVE" },
  { from: "Ghostpaw - Central Archive", to: "Echo Signal Array" },
  // Primary dossier structure
  { from: "Cryo-Chamber Grid", to: "LUSTRA_CHEM-USE_LOG_77B-A" },
  { from: "Cryo-Chamber Grid", to: "BASE_ICEHALLOW_003C" },
  { from: "Dossier Compilation", to: "DIREWOLF_RESCUE-DOC_78A" },
  { from: "Dossier Compilation", to: "TAPE_ERZA_XX17" },
  { from: "Dossier Compilation", to: "OMPF_GHOSTPAW_001A" },
  { from: "Dossier Compilation", to: "OMPF_ERZA_002B" },
  { from: "Dossier Compilation", to: "COMP_DIREWOLF_114X" },
  { from: "VOICE LOG ARCHIVE", to: "VOICE_S13-ENTRY_01A" },
  { from: "VOICE LOG ARCHIVE", to: "TAPE_02.LOG" },
  // Secret signals
  { from: "Echo Signal Array", to: "Frequency 128.3" },
  { from: "Echo Signal Array", to: "Frequency 113.7" },
  { from: "Echo Signal Array", to: "Frequency Void.Null" },
  { from: "Echo Signal Array", to: "Frequency 666.0" },
];

export default function GraphView({ onNodeClick }) {
  const container = useRef(null);

  useEffect(() => {
    if (container.current) {
      const network = new Network(
        container.current,
        { nodes, edges },
        {
          nodes: {
            font: { color: "white", face: "VT323", size: 18 },
            color: { background: "#111", border: "#88f" },
            borderWidth: 1,
            shape: "dot",
            size: 12
          },
          edges: {
            color: "#555"
          },
          layout: {
            improvedLayout: true
          },
          physics: {
            enabled: false
          },
          interaction: {
            dragView: true,
            zoomView: true
          }
        }
      );

      network.on("click", function (params) {
        if (params.nodes.length > 0) {
          const node = nodes.find(n => n.id === params.nodes[0]);
          if (node && onNodeClick) onNodeClick(node.id);
        }
      });
    }
  }, [onNodeClick]);

  return (
    <div
      ref={container}
      className="graph-view"
      style={{ width: "40vw", position: "fixed", top: 0, right: 0, height: "100%", borderLeft: "1px solid #333", zIndex: 1000 }}
    />
  );
}