import React, { useEffect, useRef } from "react";
import { Network } from "vis-network/standalone";

const nodes = [
  { id: "Site ϴ-7 - Central Archive", label: "Site ϴ-7 - Central Archive" },
  { id: "CHARACTER DOSSIERS", label: "CHARACTER DOSSIERS" },
  { id: "Operative Ghostpaw (Primary File)", label: "Operative Ghostpaw (Primary File)" },
  { id: "Commander Ezra", label: "Commander Ezra" },
  { id: "Void Manifestation", label: "Void Manifestation" },
  { id: "Dossier Compilation", label: "Dossier Compilation" },
  { id: "Squad Integration", label: "Squad Integration" },
  { id: "Psychological Profile", label: "Psychological Profile" },
  { id: "Training & Enlistment", label: "Training & Enlistment" },
  { id: "ENEMY INTEL", label: "ENEMY INTEL" },
  { id: "MISSION LOGS", label: "MISSION LOGS" },
  { id: "MISC", label: "MISC" },
  { id: "Unit Frostbound Strikers", label: "Unit Frostbound Strikers" },
  { id: "CULTURAL + RELIGIOUS", label: "CULTURAL + RELIGIOUS" },
  { id: "VOICE LOG ARCHIVE", label: "VOICE LOG ARCHIVE" },
  { id: "BASE Cryo-Station Theta-V", label: "BASE Cryo-Station Theta-V" },
  { id: "VOID STUDIES", label: "VOID STUDIES" }
];

const edges = [
  { from: "Site ϴ-7 - Central Archive", to: "CHARACTER DOSSIERS" },
  { from: "Site ϴ-7 - Central Archive", to: "Unit Frostbound Strikers" },
  { from: "Site ϴ-7 - Central Archive", to: "ENEMY INTEL" },
  { from: "Site ϴ-7 - Central Archive", to: "MISSION LOGS" },
  { from: "Site ϴ-7 - Central Archive", to: "CULTURAL + RELIGIOUS" },
  { from: "Site ϴ-7 - Central Archive", to: "VOICE LOG ARCHIVE" },
  { from: "Site ϴ-7 - Central Archive", to: "BASE Cryo-Station Theta-V" },
  { from: "Site ϴ-7 - Central Archive", to: "VOID STUDIES" },
  { from: "Site ϴ-7 - Central Archive", to: "MISC" },
  { from: "CHARACTER DOSSIERS", to: "Operative Ghostpaw (Primary File)" },
  { from: "CHARACTER DOSSIERS", to: "Commander Ezra" },
  { from: "Operative Ghostpaw (Primary File)", to: "Void Manifestation" },
  { from: "Operative Ghostpaw (Primary File)", to: "Dossier Compilation" },
  { from: "Dossier Compilation", to: "Training & Enlistment" },
  { from: "Dossier Compilation", to: "Psychological Profile" },
  { from: "Dossier Compilation", to: "Squad Integration" }
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