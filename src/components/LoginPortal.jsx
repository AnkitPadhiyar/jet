import React, { useState } from "react";
import { Plane, Shield, User, Lock, Key, Info } from "lucide-react";

export default function LoginPortal({ passengers, onLoginSuccess, speakText }) {
  const [activeTab, setActiveTab] = useState("passenger"); // passenger, staff
  
  // Passenger Form States
  const [pnr, setPnr] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Staff Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState("");

  const handlePassengerSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!pnr.trim() || !lastName.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    // Lookup passenger by Name or PNR
    // For demo purposes, we accept JTR982 / Sharma (for PAX001 Ankit)
    // Or we can match any passenger in our database. Let's lookup:
    const match = passengers.find(
      p => p.name.toLowerCase().includes(lastName.toLowerCase())
    );

    if (match && (pnr.toUpperCase() === "JTR982" || pnr.trim().length >= 4)) {
      onLoginSuccess("passenger", match);
      speakText(`Welcome back, ${match.name}. Login successful.`);
    } else {
      setError("Invalid Booking Reference (PNR) or Passenger Last Name.");
      speakText("Login failed. Please verify credentials.");
    }
  };

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    // Demo credentials: email contains @jetrecovery.com or is ops@jetrecovery.com
    if (
      (email.toLowerCase() === "ops@jetrecovery.com" && password === "admin") ||
      (email.includes("@") && password.length >= 3)
    ) {
      onLoginSuccess("staff", { name: "System Operator", email });
      speakText("Operations Control Room authorized. Welcome.");
    } else {
      setError("Invalid corporate credentials or unauthorized account.");
      speakText("Authorization denied.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-lg)",
        background: "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(9, 13, 22, 1) 90%)",
        color: "var(--text-primary)",
      }}
    >
      <div style={{ display: "flex", width: "100%", maxWidth: "1000px", gap: "var(--spacing-xl)", flexWrap: "wrap" }}>
        
        {/* Left Side: Brand Pitch & Security Specs */}
        <div style={{ flex: "1 1 450px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "var(--spacing-md)" }}>
          <div className="nav-brand" style={{ fontSize: "2.5rem", justifyContent: "flex-start", marginBottom: "var(--spacing-sm)" }}>
            <Plane size={36} style={{ color: "var(--color-primary)" }} />
            <span>JetRecovery<sup style={{ fontSize: "0.8rem", color: "var(--color-accent)" }}>AI</sup></span>
          </div>

          <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>
            Next-Generation Proactive Passenger Recovery SaaS
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Transition your airline operations from reactive conflict resolution to fully automated predictive recovery. 
            Reduce customer support loads, avoid airport passenger gridlocks, and protect your brand equity.
          </p>

          {/* CIA Triad Info Box */}
          <div
            className="glass-panel"
            style={{
              padding: "var(--spacing-md)",
              background: "rgba(99, 102, 241, 0.05)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              marginTop: "var(--spacing-md)",
            }}
          >
            <h4 style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", color: "var(--color-accent)" }}>
              <Shield size={16} />
              CIA Triad Compliance Model
            </h4>
            <ul style={{ listStyleType: "none", marginTop: "var(--spacing-sm)", fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>
                <strong>Confidentiality (C):</strong> Gated role separation prevents travelers from accessing control rooms, logs, or other passengers' records.
              </li>
              <li>
                <strong>Integrity (I):</strong> Transactional digital signatures secure all flight adjustments, seat maps, and voucher claims.
              </li>
              <li>
                <strong>Availability (A):</strong> Offline-first LocalStorage digital ticket sync maintains passenger boarding passes during network outage events.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Tabbed Login Form Card */}
        <div className="glass-panel" style={{ flex: "1 1 400px", padding: "var(--spacing-xl)", background: "var(--bg-glass-active)" }}>
          <div style={{ display: "flex", gap: "var(--spacing-sm)", borderBottom: "1px solid var(--border-color)", paddingBottom: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
            <button
              onClick={() => {
                setActiveTab("passenger");
                setError("");
                speakText("Switched to Passenger Login form");
              }}
              className={`btn ${activeTab === "passenger" ? "btn-primary" : "btn-secondary"}`}
              style={{ flex: 1, padding: "8px 12px", fontSize: "0.85rem" }}
            >
              Passenger Login
            </button>
            <button
              onClick={() => {
                setActiveTab("staff");
                setError("");
                speakText("Switched to Airline Operations login form");
              }}
              className={`btn ${activeTab === "staff" ? "btn-primary" : "btn-secondary"}`}
              style={{ flex: 1, padding: "8px 12px", fontSize: "0.85rem" }}
            >
              Airline Staff Login
            </button>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid var(--color-danger)",
                color: "var(--color-danger)",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.85rem",
                marginBottom: "var(--spacing-md)",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {activeTab === "passenger" ? (
            /* Passenger Login Form */
            <form onSubmit={handlePassengerSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "4px" }}>
                  Booking Reference (PNR)
                </label>
                <div style={{ position: "relative" }}>
                  <Key size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 10px 10px 38px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      textTransform: "uppercase",
                      outline: "none",
                    }}
                    placeholder="e.g. JTR982"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "4px" }}>
                  Passenger Last Name
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 10px 10px 38px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      outline: "none",
                    }}
                    placeholder="e.g. Sharma"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: "12px", fontSize: "1rem", marginTop: "4px" }}>
                Access My Trip
              </button>

              <div
                style={{
                  background: "var(--bg-tertiary)",
                  padding: "var(--spacing-sm)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "6px",
                  marginTop: "var(--spacing-sm)",
                }}
              >
                <Info size={14} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Demo Credentials Tip:</strong><br />
                  Use PNR: <code>JTR982</code> and LastName: <code>Sharma</code> to log in as passenger Ankit Sharma.
                </div>
              </div>
            </form>
          ) : (
            /* Staff Operations Login Form */
            <form onSubmit={handleStaffSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "4px" }}>
                  Corporate Email
                </label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 10px 10px 38px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      outline: "none",
                    }}
                    placeholder="e.g. ops@jetrecovery.com"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", marginBottom: "4px" }}>
                  Operations Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 10px 10px 38px",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      background: "var(--bg-primary)",
                      color: "var(--text-primary)",
                      outline: "none",
                    }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: "12px", fontSize: "1rem", marginTop: "4px" }}>
                Authorize Ops Dashboard
              </button>

              <div
                style={{
                  background: "var(--bg-tertiary)",
                  padding: "var(--spacing-sm)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "6px",
                  marginTop: "var(--spacing-sm)",
                }}
              >
                <Info size={14} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Demo Credentials Tip:</strong><br />
                  Use corporate Email: <code>ops@jetrecovery.com</code> and Password: <code>admin</code> to authorize operations control.
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
