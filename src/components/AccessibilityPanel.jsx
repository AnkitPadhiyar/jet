import React, { useEffect } from "react";
import { Eye, Volume2, Globe, Type, VolumeX } from "lucide-react";

export default function AccessibilityPanel({
  theme,
  setTheme,
  fontSize,
  setFontSize,
  language,
  setLanguage,
  screenReaderActive,
  setScreenReaderActive,
  speakText,
}) {
  // Apply font size class to body
  useEffect(() => {
    document.body.className = "";
    if (fontSize === "small") document.body.classList.add("font-sm");
    if (fontSize === "medium") document.body.classList.add("font-md");
    if (fontSize === "large") document.body.classList.add("font-lg");
  }, [fontSize]);

  // Apply theme attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Labels dictionary for multiple languages (Feature 12)
  const translations = {
    en: {
      title: "Accessibility & Personalization",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      hc: "High Contrast",
      fontSizeLabel: "Font Size",
      small: "A- (Small)",
      normal: "A (Normal)",
      large: "A+ (Large)",
      lang: "Language",
      reader: "Simulated Screen Reader",
      readerOn: "Voice On",
      readerOff: "Voice Off",
      announcement: "Screen reader will read out dynamic updates aloud.",
    },
    hi: {
      title: "सुलभता और वैयक्तिकरण",
      theme: "थीम",
      light: "प्रकाश",
      dark: "अंधेरा",
      hc: "उच्च कंट्रास्ट",
      fontSizeLabel: "फ़ॉन्ट आकार",
      small: "छोटा",
      normal: "सामान्य",
      large: "बड़ा",
      lang: "भाषा",
      reader: "स्क्रीन रीडर सिमुलेशन",
      readerOn: "आवाज़ चालू",
      readerOff: "आवाज़ बंद",
      announcement: "स्क्रीन रीडर गतिशील अपडेट को ज़ोर से पढ़ेगा।",
    },
    es: {
      title: "Accesibilidad y Personalización",
      theme: "Tema",
      light: "Claro",
      dark: "Oscuro",
      hc: "Alto Contraste",
      fontSizeLabel: "Tamaño de Fuente",
      small: "Pequeño",
      normal: "Normal",
      large: "Grande",
      lang: "Idioma",
      reader: "Lector de Pantalla Simulado",
      readerOn: "Voz Activa",
      readerOff: "Voz Silenciada",
      announcement: "El lector de pantalla leerá las actualizaciones dinámicas.",
    }
  };

  const t = translations[language] || translations.en;

  const handleSpeechToggle = () => {
    const newState = !screenReaderActive;
    setScreenReaderActive(newState);
    if (newState) {
      speakText(t.readerOn + ". " + t.announcement);
    } else {
      // Cancel speech
      window.speechSynthesis?.cancel();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--spacing-md)" }}>
        <h4 style={{ display: "flex", alignItems: "center", gap: "var(--spacing-sm)", fontSize: "1.1rem" }}>
          <Eye size={18} style={{ color: "var(--color-primary)" }} />
          {t.title}
        </h4>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-md)", alignItems: "center" }}>
          {/* Theme Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>{t.theme}:</span>
            <select
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
                speakText(`Theme changed to ${e.target.value}`);
              }}
              style={{
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            >
              <option value="light">{t.light}</option>
              <option value="dark">{t.dark}</option>
              <option value="high-contrast">{t.hc}</option>
            </select>
          </div>

          {/* Font Size */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
            <Type size={14} style={{ color: "var(--text-secondary)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>{t.fontSizeLabel}:</span>
            <select
              value={fontSize}
              onChange={(e) => {
                setFontSize(e.target.value);
                speakText(`Font size changed to ${e.target.value}`);
              }}
              style={{
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            >
              <option value="small">{t.small}</option>
              <option value="medium">{t.normal}</option>
              <option value="large">{t.large}</option>
            </select>
          </div>

          {/* Language Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
            <Globe size={14} style={{ color: "var(--text-secondary)" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>{t.lang}:</span>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                speakText(`Language changed to ${e.target.value}`);
              }}
              style={{
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="es">Español (Spanish)</option>
            </select>
          </div>

          {/* Simulated Screen Reader */}
          <button
            onClick={handleSpeechToggle}
            className={`btn ${screenReaderActive ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "4px 12px", fontSize: "0.85rem" }}
          >
            {screenReaderActive ? <Volume2 size={14} /> : <VolumeX size={14} />}
            {screenReaderActive ? t.readerOn : t.readerOff}
          </button>
        </div>
      </div>
    </div>
  );
}
