import React, { useState } from "react";
import {
  TrendingUp,
  AlertOctagon,
  Users,
  RotateCcw,
  Sparkles,
  CloudLightning,
  Clock,
  ThumbsUp,
  PhoneCall,
  Activity,
  UserCheck,
} from "lucide-react";

export default function OperationsDashboard({
  flights,
  passengers,
  updatePassenger,
  updateFlight,
  addLog,
  weather,
  airportStatus,
  logs,
  speakText,
}) {
  const [activeTab, setActiveTab] = useState("queue"); // queue, analytics, alerts

  // Calculate live numbers based on mock passenger statuses
  const rebookedCount = passengers.filter((p) => p.recoveryStatus === "Rebooked").length;
  const refundedCount = passengers.filter((p) => p.recoveryStatus === "Refunded").length;
  const waitingCount = passengers.filter(
    (p) => p.recoveryStatus === "Untouched" || p.recoveryStatus === "Warning" || p.recoveryStatus === "Offered"
  ).length;

  // Global aggregate counters (incorporating baseline figures + active session changes)
  const delayedFlightsCount = flights.filter((f) => f.status === "Delayed").length;
  const cancelledFlightsCount = flights.filter((f) => f.status === "Cancelled").length;

  const stats = {
    delayed: 22 + delayedFlightsCount,
    cancelled: 5 + cancelledFlightsCount,
    waiting: 1840 + waitingCount,
    refunds: 610 + refundedCount,
    rebooked: 1100 + rebookedCount,
  };

  // Sort passengers by Priority Score (Feature 8)
  const sortedPassengers = [...passengers].sort((a, b) => b.priorityScore - a.priorityScore);

  // Trigger one-click automated rebooking for a single passenger from staff side
  const handleAutoRebookPassenger = (pax) => {
    // Find best flight: AI305 if Delhi-LHR, EY256 if Ahmedebad leg delayed
    const isConnecting = pax.category === "Connecting";
    const targetFlightId = isConnecting ? "EY256" : "AI305";
    const targetFlight = flights.find((f) => f.id === targetFlightId) || flights[2];

    updatePassenger(pax.id, {
      recoveryStatus: "Rebooked",
      rebookedFlight: targetFlight.id,
      rebookedSeat: "12F",
      recoveryTime: 120, // 2 minutes
      recoveryScore: 98,
    });

    updateFlight(targetFlight.id, { seatsLeft: Math.max(0, targetFlight.seatsLeft - 1) });
    addLog(`AI Auto-Rebooked ${pax.name} to flight ${targetFlight.number} (Seat 12F) via Priority Queue.`);
    speakText(`Rebooked ${pax.name} on ${targetFlight.number}`);
  };

  // Run AI-Optimized Recovery Plan (Feature 14)
  const handleRunOptimizer = () => {
    let count = 0;
    passengers.forEach((pax) => {
      if (pax.recoveryStatus !== "Rebooked" && pax.recoveryStatus !== "Refunded") {
        const targetFlightId = pax.category === "Connecting" ? "EY256" : "AI305";
        updatePassenger(pax.id, {
          recoveryStatus: "Rebooked",
          rebookedFlight: targetFlightId,
          rebookedSeat: pax.id === "PAX001" ? "12A" : "14A",
          recoveryTime: 45, // fast 45 seconds batch
          recoveryScore: 99,
        });
        count++;
      }
    });

    addLog(`AI Operations Planner: Executed batch recovery. Automatically rebooked ${count} passengers.`);
    speakText(`Optimized recovery plan complete. Rebooked ${count} passengers in 45 seconds.`);
  };

  return (
    <div>
      {/* Top Airport Metrics Counter Cards (Feature 9) */}
      <div className="grid-3" style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
        <div className="glass-card" style={{ padding: "var(--spacing-md)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "bold" }}>Today's Delayed</span>
          <h2 style={{ color: "var(--color-warning)", display: "flex", alignItems: "baseline", gap: "4px" }}>
            {stats.delayed}
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>flights</span>
          </h2>
        </div>
        <div className="glass-card" style={{ padding: "var(--spacing-md)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "bold" }}>Cancelled Today</span>
          <h2 style={{ color: "var(--color-danger)", display: "flex", alignItems: "baseline", gap: "4px" }}>
            {stats.cancelled}
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>flights</span>
          </h2>
        </div>
        <div className="glass-card" style={{ padding: "var(--spacing-md)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "bold" }}>Passengers Waiting</span>
          <h2 style={{ color: "var(--text-primary)", display: "flex", alignItems: "baseline", gap: "4px" }}>
            {stats.waiting}
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>PAX</span>
          </h2>
        </div>
        <div className="glass-card" style={{ padding: "var(--spacing-md)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "bold" }}>Refund Requests</span>
          <h2 style={{ color: "var(--color-accent)", display: "flex", alignItems: "baseline", gap: "4px" }}>
            {stats.refunds}
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>requests</span>
          </h2>
        </div>
        <div className="glass-card" style={{ padding: "var(--spacing-md)", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "bold" }}>Rebooked & Recovered</span>
          <h2 style={{ color: "var(--color-success)", display: "flex", alignItems: "baseline", gap: "4px" }}>
            {stats.rebooked}
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>PAX</span>
          </h2>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid-2" style={{ gridTemplateColumns: "2fr 1fr" }}>
        
        {/* Left Column: Priority Queue & Analytics Tabs */}
        <div>
          {/* Navigation Bar */}
          <div style={{ display: "flex", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-md)" }}>
            <button
              onClick={() => { setActiveTab("queue"); speakText("Viewing priority queue"); }}
              className={`btn ${activeTab === "queue" ? "btn-primary" : "btn-secondary"}`}
            >
              <Users size={16} /> AI Priority Queue
            </button>
            <button
              onClick={() => { setActiveTab("analytics"); speakText("Viewing recovery analytics"); }}
              className={`btn ${activeTab === "analytics" ? "btn-primary" : "btn-secondary"}`}
            >
              <TrendingUp size={16} /> Business Analytics & KPIs
            </button>
          </div>

          {/* Tab 1: Priority Queue Grid (Feature 8) */}
          {activeTab === "queue" && (
            <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                <h3>AI-Sorted Passenger Queue</h3>
                <span className="badge badge-info">Real-time Priority Engine</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "8px" }}>
                      <th style={{ padding: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>PASSENGER</th>
                      <th style={{ padding: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>PRIORITY</th>
                      <th style={{ padding: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>URGENCY DETAILS</th>
                      <th style={{ padding: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>STATUS</th>
                      <th style={{ padding: "8px", fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "right" }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPassengers.map((pax) => (
                      <tr key={pax.id} style={{ borderBottom: "1px solid var(--border-color)", fontSize: "0.9rem" }}>
                        <td style={{ padding: "12px 8px" }}>
                          <strong>{pax.name}</strong>
                          <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            {pax.class} Class | Age: {pax.age}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          <span
                            className={`badge ${
                              pax.priorityScore >= 90
                                ? "badge-danger"
                                : pax.priorityScore >= 75
                                ? "badge-warning"
                                : "badge-info"
                            }`}
                          >
                            {pax.priorityScore}/100
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          {pax.urgencyText}
                        </td>
                        <td style={{ padding: "12px 8px" }}>
                          <span
                            className={`badge ${
                              pax.recoveryStatus === "Rebooked"
                                ? "badge-success"
                                : pax.recoveryStatus === "Refunded"
                                ? "badge-success"
                                : pax.recoveryStatus === "Offered" || pax.recoveryStatus === "Warning"
                                ? "badge-warning"
                                : "badge-info"
                            }`}
                          >
                            {pax.recoveryStatus}
                          </span>
                        </td>
                        <td style={{ padding: "12px 8px", textAlign: "right" }}>
                          {pax.recoveryStatus !== "Rebooked" && pax.recoveryStatus !== "Refunded" ? (
                            <button
                              onClick={() => handleAutoRebookPassenger(pax)}
                              className="btn btn-primary"
                              style={{ padding: "4px 8px", fontSize: "0.75rem", borderRadius: "4px" }}
                            >
                              Auto-Rebook
                            </button>
                          ) : pax.recoveryStatus === "Rebooked" ? (
                            <span style={{ fontSize: "0.8rem", color: "var(--color-success)", fontWeight: "bold" }}>
                              ✓ Saved ({pax.rebookedFlight})
                            </span>
                          ) : (
                            <span style={{ fontSize: "0.8rem", color: "var(--color-success)", fontWeight: "bold" }}>
                              ✓ Refunded
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Analytics & Business Value (Feature 10) */}
          {activeTab === "analytics" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
              {/* Business Value Cards Row */}
              <div className="grid-3" style={{ gap: "var(--spacing-md)" }}>
                {/* CSAT card */}
                <div className="glass-panel" style={{ padding: "var(--spacing-md)", display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-success-glow)", color: "var(--color-success)", display: "flex", alignItems: "center", justifyCenter: "center" }}>
                    <ThumbsUp size={20} style={{ marginLeft: "10px" }} />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Customer CSAT</span>
                    <strong style={{ fontSize: "1.2rem" }}>4.85 / 5.0</strong>
                  </div>
                </div>

                {/* Avg Recovery Time card */}
                <div className="glass-panel" style={{ padding: "var(--spacing-md)", display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-primary-glow)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyCenter: "center" }}>
                    <Clock size={20} style={{ marginLeft: "10px" }} />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Avg Recovery Time</span>
                    <strong style={{ fontSize: "1.2rem" }}>1.9 mins</strong>
                  </div>
                </div>

                {/* Support Calls Avoided card */}
                <div className="glass-panel" style={{ padding: "var(--spacing-md)", display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--color-warning-glow)", color: "var(--color-warning)", display: "flex", alignItems: "center", justifyCenter: "center" }}>
                    <PhoneCall size={20} style={{ marginLeft: "10px" }} />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Calls Prevented</span>
                    <strong style={{ fontSize: "1.2rem" }}>842 calls</strong>
                  </div>
                </div>
              </div>

              {/* Graphic CSS Charts */}
              <div className="grid-2">
                {/* Delayed Routes Chart */}
                <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
                  <h4>Most Delayed Routes (YTD)</h4>
                  <div className="chart-bar-container">
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "120px" }}></div>
                      <span className="chart-label">DEL-LHR</span>
                    </div>
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "90px" }}></div>
                      <span className="chart-label">AMD-DEL</span>
                    </div>
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "70px" }}></div>
                      <span className="chart-label">BOM-DEL</span>
                    </div>
                    <div className="chart-bar-group">
                      <div className="chart-bar" style={{ height: "40px" }}></div>
                      <span className="chart-label">DEL-JFK</span>
                    </div>
                  </div>
                </div>

                {/* Recovery Rate Breakdown */}
                <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
                  <h4>Recovery Resolution Rate</h4>
                  <div className="chart-bar-container">
                    <div className="chart-bar secondary" style={{ height: "130px" }}></div>
                    <div className="chart-bar-group" style={{ flex: 1 }}>
                      <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-success)" }}>82%</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>Rebooked Successfully</span>
                    </div>
                    <div className="chart-bar" style={{ height: "30px", background: "var(--color-danger)" }}></div>
                    <div className="chart-bar-group" style={{ flex: 1 }}>
                      <span style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--color-danger)" }}>18%</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>Refunded Cash/Voucher</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Ops Advisor, Storm alerts & Live Logs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
          {/* AI Operations Dashboard Alerts (Feature 14) */}
          <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <CloudLightning size={20} style={{ color: "var(--color-accent)" }} />
              AI Operations Planner
            </h3>
            
            <div style={{ marginTop: "var(--spacing-md)", display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Local Airport Weather</span>
                <strong>{weather}</strong>
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>System Load Status</span>
                <span className={`badge ${airportStatus === "Normal Operations" ? "badge-success" : "badge-danger"}`}>
                  {airportStatus}
                </span>
              </div>

              {/* Active Alerts */}
              {airportStatus !== "Normal Operations" && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid var(--color-danger)",
                    padding: "var(--spacing-sm)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.85rem",
                  }}
                >
                  <strong style={{ color: "var(--color-danger)", display: "block" }}>🚨 Active Alert:</strong>
                  {airportStatus.includes("Severe") ? (
                    <span>Storm landing. Estimated cancels: <strong>6 flights</strong>. Aircraft: shortage. Gate Conflicts active.</span>
                  ) : (
                    <span>Leg 1 Delay causing connecting flight disruptions for <strong>1 passenger</strong>.</span>
                  )}
                </div>
              )}

              {/* AI Auto-Optimizer Action Button */}
              {waitingCount > 0 && (
                <button
                  onClick={handleRunOptimizer}
                  className="btn btn-primary"
                  style={{ width: "100%", marginTop: "var(--spacing-md)" }}
                >
                  <Sparkles size={16} /> Run AI Auto-Recovery Plan
                </button>
              )}
            </div>
          </div>

          {/* Live Operations Logs (Operational Audit) */}
          <div className="glass-panel" style={{ padding: "var(--spacing-lg)", flex: 1, display: "flex", flexDirection: "column" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <Activity size={20} style={{ color: "var(--color-success)" }} />
              Live Operations Feed
            </h3>
            <div
              style={{
                background: "black",
                color: "#10b981",
                fontFamily: "monospace",
                fontSize: "0.75rem",
                padding: "var(--spacing-md)",
                borderRadius: "var(--radius-sm)",
                flex: 1,
                overflowY: "auto",
                maxHeight: "250px",
                marginTop: "var(--spacing-md)",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {logs.map((log, index) => (
                <div key={index}>
                  &gt; {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
