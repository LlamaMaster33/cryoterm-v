export const listReports = () => {
    return [
      ">>> Available Reports:",
      "- report001: Incident Analysis",
      "- report002: System Diagnostics",
      "- report003: Security Breach Summary"
    ];
  };
  export const listDossier = () => {
    return [
      ">>> Available Dossier:",
      "- report001: Incident Analysis",
      "- report002: System Diagnostics",
      "- report003: Security Breach Summary"
    ];
  };
  
  export const openReport = (reportId) => {
    const reports = {
      report001: "Incident Analysis: Details about the incident...",
      report002: "System Diagnostics: System health is optimal.",
      report003: "Security Breach Summary: Unauthorized access detected."
    };
  
    if (reports[reportId]) {
      return [`>>> Opening ${reportId}:`, reports[reportId]];
    } else {
      return [`>>> Report ${reportId} not found.`];
    }
  };