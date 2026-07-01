import React, { useState, useEffect } from "react";
import {
  INITIAL_FLIGHTS,
  INITIAL_PASSENGERS,
  SCENARIOS,
  calculatePriorityScore,
} from "./utils/SimulationEngine";
import AccessibilityPanel from "./components/AccessibilityPanel";
import PassengerPortal from "./components/PassengerPortal";
import OperationsDashboard from "./components/OperationsDashboard";
import LoginPortal from "./components/LoginPortal";
import { Shield, Plane, LogOut, UserCheck } from "lucide-react";

export default function App() {
  // Global States
  const [flights, setFlights] = useState(() => {
    const saved = localStorage.getItem("jet_flights");
    return saved ? JSON.parse(saved) : INITIAL_FLIGHTS;
  });
  
  const [passengers, setPassengers] = useState(() => {
    const saved = localStorage.getItem("jet_passengers");
    return saved ? JSON.parse(saved) : INITIAL_PASSENGERS;
  });

  const [weather, setWeather] = useState("Clear Skies (28°C)");
  const [airportStatus, setAirportStatus] = useState("Normal Operations");
  const [activeScenario, setActiveScenario] = useState("DEFAULT");
  
  const [logs, setLogs] = useState([
    "JetRecovery System online.",
    "Data connection established with AirTraffic control.",
    "Awaiting operational commands."
  ]);

  // Session Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'passenger' | 'staff'
  const [currentUser, setCurrentUser] = useState(null);

  // Accessibility Settings
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("medium");
  const [language, setLanguage] = useState("en");
  const [screenReaderActive, setScreenReaderActive] = useState(false);
  const [screenReaderText, setScreenReaderText] = useState("");
  
  // Offline Mode (PWA simulation)
  const [offlineMode, setOfflineMode] = useState(false);

  // Sync to LocalStorage (Offline caching fallback)
  useEffect(() => {
    localStorage.setItem("jet_flights", JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    localStorage.setItem("jet_passengers", JSON.stringify(passengers));
  }, [passengers]);

  // Add event log
  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  // Text-To-Speech engine (Feature 12 - Accessibility)
  const speakText = (text) => {
    setScreenReaderText(text);
    if (!screenReaderActive) return;
    
    // Stop any speaking first
    window.speechSynthesis?.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "en" ? "en-US" : language === "hi" ? "hi-IN" : "es-ES";
    window.speechSynthesis?.speak(utterance);
  };

  // Update Flight helper
  const updateFlight = (flightId, updates) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === flightId ? { ...f, ...updates } : f))
    );
  };

  // Update Passenger helper
  const updatePassenger = (paxId, updates) => {
    setPassengers((prev) =>
      prev.map((p) => {
        if (p.id === paxId) {
          const updated = { ...p, ...updates };
          // Re-sort priority score if properties changed
          updated.priorityScore = calculatePriorityScore(updated);
          return updated;
        }
        return p;
      })
    );
  };

  // Update Passenger wrapper for PassengerPortal (always updates logged-in passenger)
  const updatePassengerAnkit = (updates) => {
    if (currentUser) {
      updatePassenger(currentUser.id, updates);
      // Keep currentUser state in sync
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  // Handle Login Successful
  const handleLoginSuccess = (role, userObj) => {
    setUserRole(role);
    setCurrentUser(userObj);
    setIsLoggedIn(true);
    addLog(`Authentication successful. User ${userObj.name} logged in as role: ${role}.`);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    addLog(`User ${currentUser?.name} logged out.`);
    speakText("Logging out of session.");
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null);
  };

  // Scenario trigger runner
  const triggerScenario = (scenarioKey) => {
    const scenario = SCENARIOS[scenarioKey];
    if (!scenario) return;

    setActiveScenario(scenarioKey);
    setWeather(scenario.weather);
    setAirportStatus(scenario.airportStatus);
    
    // Update flights statuses
    const updatedFlights = flights.map((f) => {
      const match = scenario.flightsUpdates.find((update) => update.id === f.id);
      return match ? { ...f, ...match } : f;
    });
    setFlights(updatedFlights);

    // Reset passenger recovery stats on scenario switch to show fresh flow
    const resetPassengers = passengers.map((pax) => {
      let recoveryStatus = "Untouched";
      let notified = false;
      let rebookedFlight = null;
      let rebookedSeat = null;

      // Leg status matching
      const leg1 = updatedFlights.find((f) => f.id === pax.journey[0].flight);
      if (leg1 && leg1.status === "Cancelled") {
        recoveryStatus = "Warning";
      }

      const p = {
        ...pax,
        recoveryStatus,
        notified,
        rebookedFlight,
        rebookedSeat,
        recoveryTime: null,
      };
      p.priorityScore = calculatePriorityScore(p);
      return p;
    });
    setPassengers(resetPassengers);

    // Update active passenger state if passenger is logged in
    if (isLoggedIn && userRole === "passenger" && currentUser) {
      const matchingResetPax = resetPassengers.find(p => p.id === currentUser.id);
      if (matchingResetPax) {
        setCurrentUser(matchingResetPax);
      }
    }

    // Add scenario logs
    scenario.logs.forEach((log) => addLog(log));
    
    const voiceAnnounce = `Triggered scenario: ${scenario.name}. Weather is ${scenario.weather}.`;
    speakText(voiceAnnounce);
  };

  // Reset database values
  const handleResetData = () => {
    localStorage.removeItem("jet_flights");
    localStorage.removeItem("jet_passengers");
    setFlights(INITIAL_FLIGHTS);
    setPassengers(INITIAL_PASSENGERS);
    setWeather("Clear Skies (28°C)");
    setAirportStatus("Normal Operations");
    setActiveScenario("DEFAULT");
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null);
    setLogs(["System reset. Loaded fresh flight schedules.", "All connections optimized."]);
    speakText("Data reset. Please login again.");
  };

  // If not logged in, render the login portal auth gate
  if (!isLoggedIn) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Simulation Toolbar (always visible for reviewers to test app states) */}
        <div className="sim-toolbar" style={{ zIndex: 10 }}>
          <div className="sim-title">
            <Shield size={18} />
            <span>JetRecovery AI Simulation Panel</span>
          </div>
          <div className="sim-buttons">
            <button
              onClick={() => triggerScenario("DEFAULT")}
              className={`btn ${activeScenario === "DEFAULT" ? "btn-success" : "btn-secondary"}`}
              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
            >
              ☀️ Normal Ops
            </button>
            <button
              onClick={() => triggerScenario("STORM_DELHI")}
              className={`btn ${activeScenario === "STORM_DELHI" ? "btn-danger" : "btn-secondary"}`}
              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
            >
              ⛈️ Delhi Storm
            </button>
            <button
              onClick={() => triggerScenario("AMD_DELAY")}
              className={`btn ${activeScenario === "AMD_DELAY" ? "btn-warning" : "btn-secondary"}`}
              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
            >
              ⚙️ Leg 1 Tech Delay
            </button>
            <button
              onClick={handleResetData}
              className="btn btn-secondary"
              style={{ padding: "4px 10px", fontSize: "0.8rem" }}
            >
              🔄 Reset Data
            </button>
          </div>
        </div>

        <LoginPortal
          passengers={passengers}
          onLoginSuccess={handleLoginSuccess}
          speakText={speakText}
        />
        
        {/* Voice Feedback bottom */}
        <footer
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            color: "#00ff00",
            fontFamily: "monospace",
            fontSize: "0.8rem",
            padding: "var(--spacing-sm) var(--spacing-xl)",
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-md)",
            borderTop: "1px solid #333",
            zIndex: 100,
          }}
        >
          <Volume2Icon size={16} />
          <span>[Screen Reader Output]:</span>
          <marquee scrollamount="3" style={{ flex: 1, fontWeight: "bold" }}>
            {screenReaderText || "Awaiting audio events... Auth Gate active."}
          </marquee>
        </footer>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      
      {/* Simulation Controller Toolbar */}
      <div className="sim-toolbar" style={{ zIndex: 10 }}>
        <div className="sim-title">
          <Shield size={18} />
          <span>JetRecovery AI Simulation Panel</span>
        </div>
        <div className="sim-buttons">
          <button
            onClick={() => triggerScenario("DEFAULT")}
            className={`btn ${activeScenario === "DEFAULT" ? "btn-success" : "btn-secondary"}`}
            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
          >
            ☀️ Normal Ops
          </button>
          <button
            onClick={() => triggerScenario("STORM_DELHI")}
            className={`btn ${activeScenario === "STORM_DELHI" ? "btn-danger" : "btn-secondary"}`}
            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
          >
            ⛈️ Delhi Storm
          </button>
          <button
            onClick={() => triggerScenario("AMD_DELAY")}
            className={`btn ${activeScenario === "AMD_DELAY" ? "btn-warning" : "btn-secondary"}`}
            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
          >
            ⚙️ Leg 1 Tech Delay
          </button>
          <button
            onClick={() => triggerScenario("CREW_SHORTAGE")}
            className={`btn ${activeScenario === "CREW_SHORTAGE" ? "btn-danger" : "btn-secondary"}`}
            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
          >
            🧑‍✈️ Crew Shortage
          </button>
          <button
            onClick={() => {
              const newOffline = !offlineMode;
              setOfflineMode(newOffline);
              addLog(`Simulated connection: ${newOffline ? "OFFLINE" : "ONLINE"}`);
              speakText(newOffline ? "Airplane Mode on. Device is now offline." : "Device back online.");
            }}
            className={`btn ${offlineMode ? "btn-danger" : "btn-secondary"}`}
            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
          >
            {offlineMode ? "📡 Go Online" : "📴 Simulate Offline"}
          </button>
          <button
            onClick={handleResetData}
            className="btn btn-secondary"
            style={{ padding: "4px 10px", fontSize: "0.8rem" }}
          >
            🔄 Reset Data
          </button>
        </div>
      </div>

      {/* Main SaaS Shell Navigation */}
      <header className="navbar">
        <div className="nav-brand">
          <Plane size={24} style={{ color: "var(--color-primary)" }} />
          <span>JetRecovery<sup style={{ fontSize: "0.6rem", color: "var(--color-accent)" }}>AI</sup></span>
        </div>

        {/* User Identity and Sign Out */}
        <div className="nav-actions" style={{ gap: "var(--spacing-lg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", fontSize: "0.9rem" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }}></span>
            <span style={{ color: "var(--text-secondary)" }}>Logged as:</span>
            <strong style={{ color: "var(--text-primary)" }}>{currentUser?.name}</strong>
            <span className="badge badge-info" style={{ textTransform: "capitalize", padding: "2px 8px" }}>
              {userRole === "staff" ? "Staff Control" : "Passenger"}
            </span>
          </div>

          <button onClick={handleSignOut} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Application Area */}
      <main className="main-content">
        
        {/* Render Global Accessibility Controls */}
        <AccessibilityPanel
          theme={theme}
          setTheme={setTheme}
          fontSize={fontSize}
          setFontSize={setFontSize}
          language={language}
          setLanguage={setLanguage}
          screenReaderActive={screenReaderActive}
          setScreenReaderActive={setScreenReaderActive}
          speakText={speakText}
        />

        {/* Dynamic Route Rendering based on authentication role */}
        {userRole === "passenger" ? (
          <PassengerPortal
            flights={flights}
            passenger={currentUser}
            updatePassenger={updatePassengerAnkit}
            updateFlight={updateFlight}
            addLog={addLog}
            offlineMode={offlineMode}
            setOfflineMode={setOfflineMode}
            speakText={speakText}
            language={language}
          />
        ) : (
          <OperationsDashboard
            flights={flights}
            passengers={passengers}
            updatePassenger={updatePassenger}
            updateFlight={updateFlight}
            addLog={addLog}
            weather={weather}
            airportStatus={airportStatus}
            logs={logs}
            speakText={speakText}
          />
        )}
      </main>

      {/* Screen Reader Voice Feedback Subtitle Box */}
      <footer
        style={{
          background: "rgba(0, 0, 0, 0.9)",
          color: "#00ff00",
          fontFamily: "monospace",
          fontSize: "0.8rem",
          padding: "var(--spacing-sm) var(--spacing-xl)",
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-md)",
          borderTop: "1px solid #333",
          zIndex: 100,
        }}
      >
        <Volume2Icon size={16} />
        <span>[Screen Reader Output]:</span>
        <marquee scrollamount="3" style={{ flex: 1, fontWeight: "bold" }}>
          {screenReaderText || "Awaiting audio events... Session active."}
        </marquee>
      </footer>
    </div>
  );
}

// Inline fallback icon for cleaner compilation in case of export details
function Volume2Icon({ size }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume-2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
  );
}
