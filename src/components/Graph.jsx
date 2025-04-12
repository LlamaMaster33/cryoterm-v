// GraphView.jsx
import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";

const nodes = [
  { id: "Ghostpaw - Central Archive", label: "Ghostpaw - Central Archive" },
  { id: "Cryo-Chamber Grid", label: "Cryo-Chamber Grid" },
  { id: "Operative Ghostpaw (Primary File)", label: "Operative Ghostpaw (Primary File)" },
  { id: "Commander Ezra", label: "Commander Ezra" },
  { id: "Dossier Compilation", label: "Dossier Compilation" },
  { id: "Squad Integration", label: "Squad Integration" },
  { id: "Psychological Profile", label: "Psychological Profile" },
  { id: "Training & Enlistment", label: "Training & Enlistment" },
  { id: "Unit Frostbound Strikers", label: "Unit Frostbound Strikers" },
  { id: "CULTURAL + RELIGIOUS", label: "CULTURAL + RELIGIOUS" },
  { id: "MISSION LOGS", label: "MISSION LOGS" },
  { id: "VOICE LOG ARCHIVE", label: "VOICE LOG ARCHIVE" },
  { id: "BASE Cryo-Station Theta-V", label: "BASE Cryo-Station Theta-V" },
  // Echo Signal Frequencies (secret access)
  { id: "Frequency 128.3", label: "Frequency 128.3", x: 1000, y: -250 },
  { id: "Frequency 113.7", label: "Frequency 113.7", x: 1000, y: -100 },
  { id: "Frequency Void.Ø", label: "Frequency Void.Ø", x: 1000, y: 0 },
  { id: "Frequency 666.0", label: "Frequency 666.0", x: 1000, y: 100 },
  // Hidden Files
  { id: "ENEMY INTEL", label: "ENEMY INTEL", x: 1100, y: -100 },
  { id: "VOID STUDIES", label: "VOID STUDIES", x: 1100, y: 0 },
  { id: "Void Manifestation", label: "Void Manifestation", x: 1100, y: 50 },
  { id: "Specimen S13", label: "Specimen S13", x: 1100, y: 100 }
];

const edges = [
  { from: "Ghostpaw - Central Archive", to: "Cryo-Chamber Grid" },
  { from: "Ghostpaw - Central Archive", to: "Dossier Compilation" },
  { from: "Ghostpaw - Central Archive", to: "VOICE LOG ARCHIVE" },
  { from: "Ghostpaw - Central Archive", to: "Echo Signal Array" },
  // Primary dossier structure
  { from: "Dossier Compilation", to: "Operative Ghostpaw (Primary File)" },
  { from: "Dossier Compilation", to: "Commander Ezra" },
  { from: "Dossier Compilation", to: "Training & Enlistment" },
  { from: "Dossier Compilation", to: "Psychological Profile" },
  { from: "Dossier Compilation", to: "Squad Integration" },
  { from: "Cryo-Chamber Grid", to: "Unit Frostbound Strikers" },
  { from: "Cryo-Chamber Grid", to: "CULTURAL + RELIGIOUS" },
  { from: "Cryo-Chamber Grid", to: "MISSION LOGS" },
  { from: "Cryo-Chamber Grid", to: "BASE Cryo-Station Theta-V" },
  // Secret signals
  { from: "Frequency 113.7", to: "ENEMY INTEL" },
  { from: "Frequency Void.Ø", to: "VOID STUDIES" },
  { from: "Frequency Void.Ø", to: "Void Manifestation" },
  { from: "Frequency 666.0", to: "Specimen S13" }
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