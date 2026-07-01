import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  CreditCard,
  MessageSquare,
  Wifi,
  WifiOff,
  User,
  Plane,
  ShieldCheck,
  Ticket,
  ChevronRight,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function PassengerPortal({
  flights,
  passenger,
  updatePassenger,
  updateFlight,
  addLog,
  offlineMode,
  setOfflineMode,
  speakText,
  language,
}) {
  const [activeTab, setActiveTab] = useState("itinerary"); // itinerary, chat, refund
  const [selectedFlightForSeatMap, setSelectedFlightForSeatMap] = useState("AI305");
  const [selectedSeat, setSelectedSeat] = useState("");
  
  // Bug fix: Add manual state to force seat map visibility when passenger asks for it (Feature 13 Override)
  const [forceSeatMapVisible, setForceSeatMapVisible] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hello Ankit! I am your JetRecovery AI Assistant. I monitor your journey in real-time. If you experience any disruptions or wish to change your flight early, let me know!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [notification, setNotification] = useState(null);

  // Translations
  const translations = {
    en: {
      predictiveHeader: "Predictive Cancellation Warning",
      predictiveSub: "High Risk detected based on Weather API & Airport traffic.",
      predictiveAction: "Switch Now (No Penalty)",
      oneClickTitle: "One-Click Recovery",
      oneClickDesc: "We analyzed alternatives and pre-reserved the best option for you.",
      oneClickAccept: "Accept & Rebook Now",
      explanationTitle: "AI Rebooking Recommendations",
      seatMapTitle: "Interactive Seat Selector",
      offlineTitle: "Offline Digital Wallet",
      offlineDesc: "Access boarding passes and itineraries without internet.",
      offlineBanner: "Offline Mode Active - Showing cached data from LocalStorage.",
      chatTitle: "AI Rebooking Chatbot",
      refundTitle: "Intelligent Refund Engine",
      refundPrompt: "Select your preferred recovery payout:",
      cashRefund: "Original Payment Refund",
      voucherRefund: "125% Travel Voucher Credit",
      estTime: "Expected in 4 business days",
      instantVoucher: "Instant activation for next booking",
      recoveryScore: "Recovery Efficiency Score",
      savedText: "Saved Airline",
      supportAvoided: "Customer Support Avoided",
    },
    hi: {
      predictiveHeader: "पूर्वानुमानित रद्दीकरण चेतावनी",
      predictiveSub: "मौसम एपीआई और हवाई अड्डे के यातायात पर उच्च जोखिम।",
      predictiveAction: "अभी बदलें (बिना किसी जुर्माने के)",
      oneClickTitle: "वन-क्लिक रिकवरी",
      oneClickDesc: "हमने विकल्पों का विश्लेषण किया और आपके लिए सबसे अच्छा विकल्प आरक्षित किया है।",
      oneClickAccept: "स्वीकार करें और अभी रीबुक करें",
      explanationTitle: "एआई रीबुकिंग सिफारिशें",
      seatMapTitle: "इंटरएक्टिव सीट चयनकर्ता",
      offlineTitle: "ऑफ़लाइन डिजिटल वॉलेट",
      offlineDesc: "इंटरनेट के बिना बोर्डिंग पास और यात्रा कार्यक्रम एक्सेस करें।",
      offlineBanner: "ऑफ़लाइन मोड सक्रिय - लोकलस्टोरेज से कैश्ड डेटा दिखा रहा है।",
      chatTitle: "एआई रीबुकिंग चैटबॉट",
      refundTitle: "बुद्धिमान धनवापसी इंजन",
      refundPrompt: "अपनी पसंद की राशि वसूली भुगतान चुनें:",
      cashRefund: "मूल भुगतान धनवापसी",
      voucherRefund: "125% यात्रा वाउचर क्रेडिट",
      estTime: "4 कार्य दिवसों में अपेक्षित",
      instantVoucher: "अगली बुकिंग के लिए तत्काल सक्रियण",
      recoveryScore: "वसूली दक्षता स्कोर",
      savedText: "एयरलाइन की बचत",
      supportAvoided: "कस्टमर सपोर्ट की आवश्यकता नहीं पड़ी",
    },
    es: {
      predictiveHeader: "Advertencia de Cancelación Predictiva",
      predictiveSub: "Riesgo alto detectado según Weather API y tráfico.",
      predictiveAction: "Cambiar ahora (sin penalización)",
      oneClickTitle: "Recuperación en un clic",
      oneClickDesc: "Analizamos alternativas y reservamos la mejor opción para usted.",
      oneClickAccept: "Aceptar y volver a reservar ahora",
      explanationTitle: "Recomendaciones de AI Rebooking",
      seatMapTitle: "Selector de Asiento Interactivo",
      offlineTitle: "Monedero Digital Offline",
      offlineDesc: "Acceda a pases de abordar e itinerarios sin internet.",
      offlineBanner: "Modo Offline Activo - Mostrando datos de LocalStorage.",
      chatTitle: "Asistente Chatbot IA",
      refundTitle: "Motor de Reembolso Inteligente",
      refundPrompt: "Seleccione su pago de recuperación preferido:",
      cashRefund: "Reembolso de pago original",
      voucherRefund: "Crédito de cupón de viaje de 125%",
      estTime: "Esperado en 4 días hábiles",
      instantVoucher: "Activación instantánea para la próxima reserva",
      recoveryScore: "Puntaje de Eficiencia de Recuperación",
      savedText: "Ahorro de la aerolínea",
      supportAvoided: "Soporte al cliente evitado",
    }
  };

  const t = translations[language] || translations.en;

  // Track flight disruptions to send notifications (Feature 7)
  useEffect(() => {
    const mainLeg = passenger.journey[0];
    const connectingLeg = passenger.journey[1];
    
    const flightLeg1 = flights.find(f => f.id === mainLeg.flight);
    const flightLeg2 = connectingLeg ? flights.find(f => f.id === connectingLeg.flight) : null;

    if (flightLeg1.status === "Cancelled" && !passenger.notified) {
      const msg = `Hello ${passenger.name}, your flight ${flightLeg1.number} has been cancelled. We've reserved seat 12A on ${flights[2].number} tomorrow at 8:00 AM. Tap to confirm.`;
      setNotification({
        title: "Flight Disruption Notice",
        message: msg,
        flightId: flights[2].id,
      });
      speakText(msg);
      updatePassenger({ notified: true, recoveryStatus: "Offered" });
    } else if (flightLeg1.status === "Delayed" && flightLeg1.delayMinutes >= 120 && !passenger.notified) {
      // Connect check: Ahmedebad delay causing miss connection to Delhi (Feature 4)
      if (connectingLeg && flightLeg2) {
        const msg = `Alert: Leg 1 delay (${flightLeg1.delayMinutes}m) will cause you to miss your London connection ${flightLeg2.number}. Let's secure direct flight EY256 instead.`;
        setNotification({
          title: "Connection Risk Detected",
          message: msg,
          flightId: "EY256",
        });
        speakText(msg);
        updatePassenger({ notified: true, recoveryStatus: "Warning" });
      }
    }
  }, [flights, passenger.notified]);

  // Handle One-Click Recovery Confirm (Feature 3)
  const handleOneClickAccept = (flightId) => {
    const flight = flights.find((f) => f.id === flightId);
    if (!flight) return;

    // Simulate rebook action
    updatePassenger({
      recoveryStatus: "Rebooked",
      rebookedFlight: flight.id,
      rebookedSeat: selectedSeat || "12A",
      recoveryTime: 180, // simulated 3 mins
      recoveryScore: 98,
    });
    
    // Update flight seat list count
    updateFlight(flight.id, { seatsLeft: Math.max(0, flight.seatsLeft - 1) });

    addLog(`Passenger ${passenger.name} auto-rebooked on flight ${flight.number} via One-Click Recovery.`);
    speakText(`Success. You have been rebooked on flight ${flight.number}, seat ${selectedSeat || "12A"}.`);
    setNotification(null);
    setForceSeatMapVisible(false);
  };

  const handleRefundSelect = (type) => {
    updatePassenger({
      recoveryStatus: "Refunded",
      refundType: type,
      recoveryTime: 90,
      recoveryScore: 90,
    });
    addLog(`Passenger ${passenger.name} selected a ${type === "Credit" ? "125% Travel Credit" : "Cash Refund"}.`);
    speakText(`Refund submitted. Your ${type === "Credit" ? "125% Travel Credit has been added to your wallet" : "refund is expected in 4 business days"}.`);
  };

  // Chat message submission - Overhauled to prevent chatbot hallucinations and support state checks (Feature 5)
  const handleChatSend = (textToSend = chatInput) => {
    if (!textToSend.trim()) return;

    const newMsgs = [...chatMessages, { id: chatMessages.length + 1, sender: "user", text: textToSend }];
    setChatMessages(newMsgs);
    setChatInput("");

    let reply = "";
    let options = [];

    const lower = textToSend.toLowerCase();
    const currentStatus = passenger.recoveryStatus;

    // Smart Context Matching
    if (lower.includes("map") || lower.includes("seat") || lower.includes("where is") || lower.includes("see map")) {
      if (currentStatus === "Untouched") {
        reply = "The seat map is currently hidden because your flight is on-time. Seat selections are finalized until a disruption occurs. However, you can force the seat map to display at the bottom of the page now using the button below.";
        options = [
          { text: "Reveal Seat Map (Force Open)", action: () => { setForceSeatMapVisible(true); speakText("Seat map visible at the bottom."); } }
        ];
      } else if (currentStatus === "Rebooked") {
        reply = `You have already rebooked on Flight ${passenger.rebookedFlight} (Seat ${passenger.rebookedSeat}). Would you like to review or change your seat selection?`;
        options = [
          { text: "Modify Rebooked Seat", action: () => { setForceSeatMapVisible(true); speakText("Seat map editor active at the bottom."); } }
        ];
      } else {
        reply = "The interactive seat map is active and displayed at the bottom of the page. You can choose Window, Aisle, or Extra Legroom seats there.";
        setForceSeatMapVisible(true);
      }
    } else if (lower.includes("cancel") || lower.includes("disrupt") || lower.includes("alternative") || lower.includes("rebook")) {
      if (currentStatus === "Untouched") {
        reply = "Currently, your flight is operating normally. If you'd like to test the recovery flow, please trigger one of the simulation triggers (e.g. 'Delhi Storm') in the top toolbar to simulate a cancellation.";
      } else {
        const primaryAlt = flights[2]; // AI305
        reply = `Your flight has disruption risks. I recommend flight ${primaryAlt.number} departing at ${primaryAlt.depTime}. Would you like to rebook on this recommended option?`;
        options = [
          { text: `Rebook on ${primaryAlt.number}`, action: () => handleOneClickAccept(primaryAlt.id) },
          { text: "View Other Alternatives", action: () => { setActiveTab("itinerary"); speakText("Showing itinerary alternatives."); } }
        ];
      }
    } else if (lower.includes("refund") || lower.includes("money") || lower.includes("voucher") || lower.includes("credit")) {
      if (currentStatus === "Refunded") {
        reply = `Your refund of ₹${passenger.refundType === "Credit" ? passenger.refundAmount * 1.25 : passenger.refundAmount} has already been registered. No further actions needed.`;
      } else {
        reply = `Since your flight itinerary has active delays or disruption alerts, you are eligible for a refund. I can issue a 100% refund (₹${passenger.refundAmount}) or a 125% Travel Credit Voucher (₹${passenger.refundAmount * 1.25}) instantly.`;
        options = [
          { text: "Claim 125% Voucher", action: () => handleRefundSelect("Credit") },
          { text: "Request 100% Cash Refund", action: () => handleRefundSelect("Cash") }
        ];
      }
    } else {
      // Default help fallback
      reply = "I'm your JetRecovery Assistant. How can I help you today? I can help search alternatives, configure seating, or claim refunds.";
      options = [
        { text: "Check Alternatives", action: () => handleChatSend("alternative flights") },
        { text: "Configure Seating Map", action: () => handleChatSend("seat map") },
        { text: "Refund Options", action: () => handleChatSend("refund details") }
      ];
    }

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { id: prev.length + 1, sender: "bot", text: reply, options },
      ]);
      speakText(reply);
    }, 500);
  };

  // Find active flight objects
  const leg1Flight = flights.find(f => f.id === passenger.journey[0].flight);
  const leg2Flight = passenger.journey[1] ? flights.find(f => f.id === passenger.journey[1].flight) : null;

  return (
    <div>
      {/* Offline Banner Indicator (Feature 11) */}
      {offlineMode && (
        <div className="offline-banner">
          <WifiOff size={18} />
          <span>{t.offlineBanner}</span>
        </div>
      )}

      {/* Push Notification Simulator Box (Feature 7) */}
      {notification && !offlineMode && (
        <div
          className="glass-panel pulse-border-danger"
          style={{
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(0,0,0,0.02))",
            border: "2px solid var(--color-danger)",
            padding: "var(--spacing-md)",
            marginBottom: "var(--spacing-lg)",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div style={{ display: "flex", gap: "var(--spacing-md)", alignItems: "flex-start" }}>
            <AlertTriangle size={24} style={{ color: "var(--color-danger)", flexShrink: 0 }} />
            <div>
              <h4 style={{ color: "var(--color-danger)", display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
                {notification.title}
                <span className="badge badge-danger">Immediate Action Required</span>
              </h4>
              <p style={{ marginTop: "4px", fontSize: "0.95rem", fontWeight: "500" }}>{notification.message}</p>
              <div style={{ marginTop: "var(--spacing-md)", display: "flex", gap: "var(--spacing-sm)" }}>
                <button
                  onClick={() => handleOneClickAccept(notification.flightId)}
                  className="btn btn-primary"
                  style={{ padding: "8px 16px" }}
                >
                  Confirm & Lock Reserved Seat
                </button>
                <button
                  onClick={() => {
                    setActiveTab("chat");
                    setNotification(null);
                  }}
                  className="btn btn-secondary"
                  style={{ padding: "8px 16px" }}
                >
                  View Other Options
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Top Overview Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          gap: "var(--spacing-lg)",
          marginBottom: "var(--spacing-lg)",
          flexWrap: "wrap",
        }}
      >
        {/* Passenger Profile Glass Card */}
        <div className="glass-card" style={{ flex: "1 1 300px", display: "flex", gap: "var(--spacing-md)", alignItems: "center" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "var(--radius-full)",
              background: "var(--color-primary-glow)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={30} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <h3>{passenger.name}</h3>
              <span className="badge badge-info">{passenger.class} Class</span>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "2px" }}>
              ID: {passenger.id} | Email: {passenger.email}
            </p>
            {passenger.needsAssistance && (
              <span
                style={{
                  fontSize: "0.75rem",
                  background: "var(--color-warning-glow)",
                  color: "var(--color-warning)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                Special Assistance Required
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Recovery Score Gauge (Feature 15) */}
        <div className="glass-card" style={{ flex: "1 1 300px", minWidth: "280px" }}>
          <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "bold" }}>
                {t.recoveryScore}
              </span>
              <h2 style={{ fontSize: "2rem", display: "flex", alignItems: "baseline", gap: "4px", marginTop: "2px" }}>
                {passenger.recoveryStatus === "Untouched" ? "--" : `${passenger.recoveryScore}/100`}
                <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "normal" }}>KPI</span>
              </h2>
            </div>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-sm)",
                background: "var(--color-success-glow)",
                color: "var(--color-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={28} />
            </div>
          </div>
          <div style={{ marginTop: "var(--spacing-sm)", borderTop: "1px solid var(--border-color)", paddingTop: "var(--spacing-sm)" }}>
            {passenger.recoveryStatus === "Untouched" ? (
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                No active recovery actions yet. Status normal.
              </p>
            ) : (
              <div style={{ display: "flex", justifyBetween: "space-between", fontSize: "0.8rem" }}>
                <span>⏱️ Recovery Time: {passenger.recoveryTime}s</span>
                <span>💰 {t.savedText}: ₹{passenger.recoveryStatus === "Refunded" ? "0" : "1,250"}</span>
                <span className="badge badge-success">✓ {t.supportAvoided}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{ display: "flex", gap: "var(--spacing-sm)", marginBottom: "var(--spacing-md)" }}>
        <button
          onClick={() => {
            setActiveTab("itinerary");
            speakText("Navigated to flight itinerary tab");
          }}
          className={`btn ${activeTab === "itinerary" ? "btn-primary" : "btn-secondary"}`}
        >
          <Plane size={16} /> Itinerary & Boarding Pass
        </button>
        <button
          disabled={offlineMode}
          onClick={() => {
            setActiveTab("chat");
            speakText("Navigated to AI Chatbot tab");
          }}
          className={`btn ${activeTab === "chat" ? "btn-primary" : "btn-secondary"}`}
          style={{ opacity: offlineMode ? 0.5 : 1 }}
        >
          <MessageSquare size={16} /> AI Chatbot
        </button>
        <button
          disabled={offlineMode}
          onClick={() => {
            setActiveTab("refund");
            speakText("Navigated to refund engine tab");
          }}
          className={`btn ${activeTab === "refund" ? "btn-primary" : "btn-secondary"}`}
          style={{ opacity: offlineMode ? 0.5 : 1 }}
        >
          <CreditCard size={16} /> Refund Engine
        </button>
      </div>

      {/* Render active tab contents */}
      {activeTab === "itinerary" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
          {/* Predictive Warning Banner (Feature 1) */}
          {!offlineMode && leg1Flight.riskScore > 50 && passenger.recoveryStatus === "Untouched" && (
            <div
              className="glass-panel"
              style={{
                background: "linear-gradient(90deg, rgba(245,158,11,0.1), rgba(0,0,0,0))",
                borderColor: "var(--color-warning)",
                padding: "var(--spacing-md)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "var(--spacing-md)",
              }}
            >
              <div style={{ display: "flex", gap: "var(--spacing-md)", alignItems: "center" }}>
                <Clock size={24} style={{ color: "var(--color-warning)" }} />
                <div>
                  <h4 style={{ color: "var(--color-warning)" }}>{t.predictiveHeader} ({leg1Flight.riskScore}% risk)</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{t.predictiveSub}</p>
                </div>
              </div>
              <button onClick={() => { setActiveTab("chat"); handleChatSend("alternative flights"); }} className="btn btn-primary" style={{ padding: "6px 14px" }}>
                <Sparkles size={14} /> {t.predictiveAction}
              </button>
            </div>
          )}

          {/* Current Flight Cards */}
          <div className="grid-2">
            {/* Flight Leg 1 Card */}
            <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
              <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                <span className="badge badge-info">{leg1Flight.number}</span>
                <span
                  className={`badge ${
                    leg1Flight.status === "On Time"
                      ? "badge-success"
                      : leg1Flight.status === "Delayed"
                      ? "badge-warning"
                      : "badge-danger"
                  }`}
                >
                  {leg1Flight.status} {leg1Flight.delayMinutes > 0 ? `(${leg1Flight.delayMinutes}m)` : ""}
                </span>
              </div>
              
              <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", margin: "var(--spacing-md) 0" }}>
                <div>
                  <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-display)" }}>{leg1Flight.origin}</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Ahmedabad Airport</p>
                </div>
                <ArrowRight size={24} style={{ color: "var(--text-muted)" }} />
                <div>
                  <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-display)", textAlign: "right" }}>{leg1Flight.destination}</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "right" }}>Delhi Terminal 3</p>
                </div>
              </div>

              <div style={{ display: "flex", justifyBetween: "space-between", fontSize: "0.9rem", color: "var(--text-secondary)", borderTop: "1px solid var(--border-color)", paddingTop: "var(--spacing-md)" }}>
                <span>🕒 Dep: {leg1Flight.depTime}</span>
                <span>🚪 Gate: {leg1Flight.gate}</span>
                <span>Seat: {passenger.journey[0].seat}</span>
              </div>
            </div>

            {/* Flight Leg 2 Card (Delhi -> London) */}
            {passenger.journey[1] && (
              <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
                <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                  <span className="badge badge-info">{leg2Flight.number}</span>
                  <span
                    className={`badge ${
                      leg2Flight.status === "On Time"
                        ? "badge-success"
                        : leg2Flight.status === "Delayed"
                        ? "badge-warning"
                        : "badge-danger"
                    }`}
                  >
                    {leg2Flight.status}
                  </span>
                </div>
                
                <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", margin: "var(--spacing-md) 0" }}>
                  <div>
                    <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-display)" }}>{leg2Flight.origin}</h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Delhi Terminal 3</p>
                  </div>
                  <ArrowRight size={24} style={{ color: "var(--text-muted)" }} />
                  <div>
                    <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-display)", textAlign: "right" }}>{leg2Flight.destination}</h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", textAlign: "right" }}>London Heathrow T5</p>
                  </div>
                </div>

                <div style={{ display: "flex", justifyBetween: "space-between", fontSize: "0.9rem", color: "var(--text-secondary)", borderTop: "1px solid var(--border-color)", paddingTop: "var(--spacing-md)" }}>
                  <span>🕒 Dep: {leg2Flight.depTime}</span>
                  <span>🚪 Gate: {leg2Flight.gate}</span>
                  <span>Seat: {passenger.journey[1].seat}</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Rebooking Cards (Feature 2 & 3) */}
          {passenger.recoveryStatus !== "Untouched" && passenger.recoveryStatus !== "Refunded" && (
            <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
              <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
                <h3 style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
                  <Sparkles size={20} style={{ color: "var(--color-accent)" }} />
                  {passenger.recoveryStatus === "Rebooked" ? "Rebooked Flight Details" : t.oneClickTitle}
                </h3>
                {passenger.recoveryStatus === "Rebooked" && (
                  <span className="badge badge-success">Confirmed & Ticketed</span>
                )}
              </div>

              {passenger.recoveryStatus === "Rebooked" ? (
                // Rebooked flight details
                <div>
                  <p style={{ marginBottom: "var(--spacing-sm)" }}>
                    You have successfully switched to Flight <strong>{passenger.rebookedFlight}</strong>.
                  </p>
                  <div
                    style={{
                      background: "var(--bg-tertiary)",
                      padding: "var(--spacing-md)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-color)",
                      display: "flex",
                      justifyBetween: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4>{flights.find(f => f.id === passenger.rebookedFlight)?.number}</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        Departs: {flights.find(f => f.id === passenger.rebookedFlight)?.depTime}
                      </p>
                    </div>
                    <div>
                      <span className="badge badge-info">Seat {passenger.rebookedSeat}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Rebooking selection options
                <div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "var(--spacing-md)" }}>
                    {t.oneClickDesc}
                  </p>

                  <div className="grid-2" style={{ alignItems: "stretch" }}>
                    {/* Primary Option Card */}
                    <div
                      className="glass-card"
                      style={{
                        borderColor: "var(--color-primary)",
                        background: "var(--color-primary-glow)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center" }}>
                          <span className="badge badge-success">Recommended</span>
                          <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{flights[2].number}</span>
                        </div>
                        <h4 style={{ margin: "var(--spacing-sm) 0" }}>Delhi (DEL) → London (LHR)</h4>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "var(--spacing-sm)" }}>
                          🕒 Departs: {flights[2].depTime}
                        </p>
                        <ul style={{ listStyleType: "none", fontSize: "0.8rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "2px" }}>
                          <li>✓ Earliest Arrival</li>
                          <li>✓ Window Seat Available</li>
                          <li>✓ Same Fare Class</li>
                          <li>✓ {flights[2].onTimeHistory}% On-time history</li>
                        </ul>
                        <div
                          style={{
                            background: "var(--bg-secondary)",
                            padding: "8px",
                            borderRadius: "var(--radius-sm)",
                            fontSize: "0.8rem",
                            border: "1px dashed var(--border-color)",
                            marginTop: "8px",
                            fontStyle: "italic",
                          }}
                        >
                          "{flights[2].explanation}"
                        </div>
                      </div>
                      <button
                        onClick={() => handleOneClickAccept(flights[2].id)}
                        className="btn btn-primary"
                        style={{ marginTop: "var(--spacing-md)", width: "100%" }}
                      >
                        {t.oneClickAccept}
                      </button>
                    </div>

                    {/* Alternatives Selector */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)" }}>
                        Other Available Flights
                      </span>
                      {flights.slice(3).map((f) => (
                        <div
                          key={f.id}
                          className="glass-card interactive"
                          style={{ padding: "var(--spacing-sm)", display: "flex", justifyBetween: "space-between", alignItems: "center" }}
                          onClick={() => {
                            setSelectedFlightForSeatMap(f.id);
                            speakText(`Selected flight ${f.number}`);
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: "bold" }}>{f.number}</span>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                              {f.origin} → {f.destination} | {f.depTime}
                            </p>
                          </div>
                          <ChevronRight size={16} />
                        </div>
                      ))}

                      {/* Seat Map component trigger */}
                      <div style={{ marginTop: "auto", borderTop: "1px solid var(--border-color)", paddingTop: "var(--spacing-sm)" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                          Seating Preference: {selectedSeat || "12A (Default)"}
                        </span>
                        <a
                          href="#seat-map"
                          onClick={() => { setForceSeatMapVisible(true); speakText("Navigating to seat selector"); }}
                          style={{ fontSize: "0.85rem", color: "var(--color-primary)", fontWeight: "bold", textDecoration: "none" }}
                        >
                          Customize Seat Selection →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Offline Digital Wallet boarding pass (Feature 11) */}
          <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
            <h3 style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)" }}>
              <Ticket size={20} style={{ color: "var(--color-primary)" }} />
              {t.offlineTitle}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "var(--spacing-md)" }}>
              {t.offlineDesc}
            </p>

            <div
              style={{
                background: "linear-gradient(135deg, #1e1b4b, #311042)",
                color: "white",
                padding: "var(--spacing-xl)",
                borderRadius: "var(--radius-md)",
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Decorative elements */}
              <div
                style={{
                  position: "absolute",
                  right: "-20px",
                  bottom: "-20px",
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  background: "radial-gradient(var(--color-accent), transparent 70%)",
                  opacity: 0.3,
                }}
              ></div>

              <div style={{ display: "flex", justifyBetween: "space-between", borderBottom: "1px dashed rgba(255,255,255,0.2)", paddingBottom: "var(--spacing-md)" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.7 }}>Passenger Ticket</span>
                  <h3 style={{ color: "white" }}>{passenger.name}</h3>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.7 }}>Flight</span>
                  <h3 style={{ color: "white" }}>
                    {passenger.recoveryStatus === "Rebooked" ? passenger.rebookedFlight : leg1Flight.number}
                  </h3>
                </div>
              </div>

              <div style={{ display: "flex", justifyBetween: "space-between", margin: "var(--spacing-md) 0" }}>
                <div>
                  <h1 style={{ color: "white", fontSize: "2.5rem", fontFamily: "var(--font-display)" }}>
                    {passenger.recoveryStatus === "Rebooked"
                      ? flights.find(f => f.id === passenger.rebookedFlight)?.origin
                      : leg1Flight.origin}
                  </h1>
                  <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>Ahmedabad</span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Plane size={24} style={{ transform: "rotate(90deg)", opacity: 0.5 }} />
                </div>
                <div style={{ textAlign: "right" }}>
                  <h1 style={{ color: "white", fontSize: "2.5rem", fontFamily: "var(--font-display)" }}>
                    {passenger.recoveryStatus === "Rebooked"
                      ? flights.find(f => f.id === passenger.rebookedFlight)?.destination
                      : leg1Flight.destination}
                  </h1>
                  <span style={{ fontSize: "0.8rem", opacity: 0.7 }}>Delhi</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyBetween: "space-between", fontSize: "0.85rem" }}>
                <div>
                  <span style={{ display: "block", opacity: 0.7 }}>SEAT</span>
                  <strong>{passenger.recoveryStatus === "Rebooked" ? passenger.rebookedSeat : passenger.journey[0].seat}</strong>
                </div>
                <div>
                  <span style={{ display: "block", opacity: 0.7 }}>CLASS</span>
                  <strong>{passenger.class}</strong>
                </div>
                <div>
                  <span style={{ display: "block", opacity: 0.7 }}>STATUS</span>
                  <span className="badge badge-success" style={{ background: "rgba(16,185,129,0.3)", color: "#10b981", border: "none" }}>
                    ✓ Synced
                  </span>
                </div>
              </div>

              <div style={{ borderTop: "1px dashed rgba(255,255,255,0.2)", marginTop: "var(--spacing-md)", paddingTop: "var(--spacing-md)", display: "flex", justifyBetween: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ display: "block", fontSize: "0.6rem", opacity: 0.5, letterSpacing: "1px" }}>DIGITAL SECURITY TOKEN</span>
                  <code style={{ fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>
                    JTR-TOKEN-HASH-{passenger.id}-77B9
                  </code>
                </div>
                <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>CIA INTEGRITY VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "chat" && (
        <div className="glass-panel chat-window">
          <div className="chat-history">
            {chatMessages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div className={`chat-bubble ${msg.sender}`}>
                  {msg.text}

                  {msg.options && (
                    <div className="chat-actions">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            speakText(`Selected option: ${opt.text}`);
                            opt.action();
                          }}
                          className="btn btn-secondary"
                          style={{
                            padding: "6px 12px",
                            fontSize: "0.8rem",
                            borderRadius: "var(--radius-sm)",
                            background: "var(--bg-secondary)",
                            borderColor: "var(--color-primary)",
                          }}
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
              className="chat-input"
              placeholder="Type e.g., 'where is the map', 'i need a refund', 'help me rebook'..."
            />
            <button
              onClick={() => handleChatSend()}
              className="btn btn-primary"
              style={{ padding: "8px 16px" }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {activeTab === "refund" && (
        <div className="glass-panel" style={{ padding: "var(--spacing-lg)" }}>
          <h3>{t.refundTitle}</h3>
          
          {passenger.recoveryStatus === "Refunded" ? (
            <div style={{ textAlign: "center", padding: "var(--spacing-xl) 0" }}>
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "var(--color-success-glow)",
                  color: "var(--color-success)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "var(--spacing-md)",
                }}
              >
                <CheckCircle2 size={40} />
              </div>
              <h2>Refund Request Submitted</h2>
              <p style={{ color: "var(--text-secondary)", marginTop: "var(--spacing-xs)" }}>
                Amount: <strong style={{ color: "var(--text-primary)", fontSize: "1.3rem" }}>₹{passenger.refundType === "Credit" ? passenger.refundAmount * 1.25 : passenger.refundAmount}</strong>
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "4px" }}>
                {passenger.refundType === "Credit"
                  ? "Voucher code sent to email. Active immediately."
                  : "Expected back on original credit card within 4 business days."}
              </p>
            </div>
          ) : (
            <div>
              <p style={{ color: "var(--text-secondary)", marginBottom: "var(--spacing-lg)" }}>
                {t.refundPrompt}
              </p>

              <div className="grid-2">
                {/* Cash Refund Card */}
                <div
                  className="glass-card interactive"
                  onClick={() => handleRefundSelect("Cash")}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "200px",
                  }}
                >
                  <div>
                    <h4 style={{ display: "flex", justifyBetween: "space-between", alignItems: "center" }}>
                      {t.cashRefund}
                    </h4>
                    <h2 style={{ fontSize: "2.2rem", margin: "var(--spacing-sm) 0", color: "var(--text-primary)" }}>
                      ₹{passenger.refundAmount}
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {t.estTime}. 100% refund.
                    </p>
                  </div>
                  <button className="btn btn-secondary" style={{ marginTop: "var(--spacing-md)", width: "100%" }}>
                    Request Cash Refund
                  </button>
                </div>

                {/* 125% Travel Credit Card */}
                <div
                  className="glass-card interactive"
                  onClick={() => handleRefundSelect("Credit")}
                  style={{
                    borderColor: "var(--color-success)",
                    background: "var(--color-success-glow)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "200px",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center" }}>
                      <h4 style={{ color: "var(--color-success)" }}>{t.voucherRefund}</h4>
                      <span className="badge badge-success">+25% Bonus</span>
                    </div>
                    <h2 style={{ fontSize: "2.2rem", margin: "var(--spacing-sm) 0", color: "var(--color-success)" }}>
                      ₹{passenger.refundAmount * 1.25}
                    </h2>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {t.instantVoucher}.
                    </p>
                  </div>
                  <button className="btn btn-success" style={{ marginTop: "var(--spacing-md)", width: "100%" }}>
                    Claim 125% Voucher
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bug Fix: Render the seat map selector GLOBALLY at the bottom of the page (Feature 13 Override) */}
      {(passenger.recoveryStatus === "Offered" || forceSeatMapVisible) && (
        <div id="seat-map" className="glass-panel" style={{ padding: "var(--spacing-lg)", marginTop: "var(--spacing-lg)", animation: "slideIn var(--transition-fast) forwards" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-md)" }}>
            <h3>{t.seatMapTitle} ({selectedFlightForSeatMap})</h3>
            <button
              onClick={() => setForceSeatMapVisible(false)}
              className="btn btn-secondary"
              style={{ padding: "4px 8px", fontSize: "0.75rem" }}
            >
              Close Seat Map
            </button>
          </div>
          
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "var(--spacing-md)" }}>
            Pre-assigned seat: <strong>{selectedSeat || "12A"}</strong>. Select a seat coordinate on the flight deck configuration:
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "var(--spacing-xl)", flexWrap: "wrap" }}>
            {/* SVG/HTML Seat Map */}
            <div>
              <div className="seat-map-grid">
                <div style={{ gridColumn: "span 3", textAlign: "center", fontSize: "0.75rem", fontWeight: "bold" }}>Window / Aisle</div>
                <div className="seat-aisle"></div>
                <div style={{ gridColumn: "span 3", textAlign: "center", fontSize: "0.75rem", fontWeight: "bold" }}>Aisle / Window</div>

                {/* Row 12 */}
                <button
                  onClick={() => { setSelectedSeat("12A"); speakText("Selected Seat 12A. Window. Extra Legroom."); }}
                  className={`seat available extra-legroom ${selectedSeat === "12A" ? "selected" : ""}`}
                >
                  12A
                </button>
                <div className="seat occupied">12B</div>
                <button
                  onClick={() => { setSelectedSeat("12C"); speakText("Selected Seat 12C. Aisle. Extra Legroom."); }}
                  className={`seat available extra-legroom ${selectedSeat === "12C" ? "selected" : ""}`}
                >
                  12C
                </button>
                <div className="seat-aisle"></div>
                <button
                  onClick={() => { setSelectedSeat("12D"); speakText("Selected Seat 12D. Aisle. Extra Legroom."); }}
                  className={`seat available extra-legroom ${selectedSeat === "12D" ? "selected" : ""}`}
                >
                  12D
                </button>
                <div className="seat occupied">12E</div>
                <button
                  onClick={() => { setSelectedSeat("12F"); speakText("Selected Seat 12F. Window. Extra Legroom."); }}
                  className={`seat available extra-legroom ${selectedSeat === "12F" ? "selected" : ""}`}
                >
                  12F
                </button>

                {/* Row 14 */}
                <button
                  onClick={() => { setSelectedSeat("14A"); speakText("Selected Seat 14A. Window."); }}
                  className={`seat available ${selectedSeat === "14A" ? "selected" : ""}`}
                >
                  14A
                </button>
                <button
                  onClick={() => { setSelectedSeat("14B"); speakText("Selected Seat 14B. Middle."); }}
                  className={`seat available ${selectedSeat === "14B" ? "selected" : ""}`}
                >
                  14B
                </button>
                <div className="seat occupied">14C</div>
                <div className="seat-aisle"></div>
                <button
                  onClick={() => { setSelectedSeat("14D"); speakText("Selected Seat 14D. Aisle."); }}
                  className={`seat available ${selectedSeat === "14D" ? "selected" : ""}`}
                >
                  14D
                </button>
                <button
                  onClick={() => { setSelectedSeat("14E"); speakText("Selected Seat 14E. Middle."); }}
                  className={`seat available ${selectedSeat === "14E" ? "selected" : ""}`}
                >
                  14E
                </button>
                <button
                  onClick={() => { setSelectedSeat("14F"); speakText("Selected Seat 14F. Window."); }}
                  className={`seat available ${selectedSeat === "14F" ? "selected" : ""}`}
                >
                  14F
                </button>
              </div>

              {/* Legend */}
              <div style={{ display: "flex", gap: "var(--spacing-md)", justifyContent: "center", marginTop: "var(--spacing-md)", fontSize: "0.8rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "16px", height: "16px", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}></div>
                  <span>Standard</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "16px", height: "16px", background: "var(--bg-secondary)", borderBottom: "3px solid var(--color-accent)" }}></div>
                  <span>Extra Legroom</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "16px", height: "16px", background: "rgba(148,163,184,0.2)" }}></div>
                  <span>Occupied</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <div style={{ width: "16px", height: "16px", background: "var(--color-primary)" }}></div>
                  <span>Selected</span>
                </div>
              </div>
            </div>

            {/* AI Advisor Panel */}
            <div style={{ flex: 1, minWidth: "220px", display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>
              <div className="glass-card" style={{ background: "var(--bg-tertiary)" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={14} style={{ color: "var(--color-accent)" }} />
                  AI Seating Advisor
                </h4>
                <p style={{ fontSize: "0.85rem", marginTop: "4px", color: "var(--text-secondary)" }}>
                  "We suggest seat <strong>12A</strong> because it has <strong>Extra Legroom</strong>, a <strong>Window view</strong>, and matches your preference for front-cabin seating."
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Current Selection:</span>
                <strong style={{ fontSize: "1.2rem", color: "var(--color-primary)" }}>
                  {selectedSeat ? `Seat ${selectedSeat}` : "Seat 12A (Reserved)"}
                </strong>
              </div>
              {(passenger.recoveryStatus !== "Rebooked" || forceSeatMapVisible) && (
                <button
                  onClick={() => handleOneClickAccept(selectedFlightForSeatMap)}
                  className="btn btn-primary"
                >
                  Confirm Rebooking on {selectedFlightForSeatMap} with Seat {selectedSeat || "12A"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
