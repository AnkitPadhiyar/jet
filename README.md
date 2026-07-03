Team Name : The Mystics
Team Members: Ankitkumar Mahenrasinh Padhiyar
              Patel Ved Kanubhai




# ✈️ JetRecovery AI

> **Next-Generation Proactive Passenger Recovery & Airline Operations SaaS Platform**

JetRecovery is an AI-powered, enterprise-grade SaaS platform designed to transform how airlines manage flight disruptions. Instead of reacting to cancellations, JetRecovery uses predictive modeling (Weather APIs + Historical Delays) to resolve passenger itineraries **proactively** before gridlocks occur.

It features a secure **Passenger Self-Service Portal** (with AI chat, interactive SVG seat selection, and offline digital ticket wallets) paired with an **Airline Operations Control Dashboard** (featuring live stats, automated priority queue scheduling, storm planner simulations, and business analytics).

---

## 🚀 Key Features

JetRecovery implements **15 core features** to demonstrate SaaS product value:

### 👤 Passenger Portal (Self-Service)
1. **Predictive Recovery**: Proactive warnings based on weather risk scores (e.g. 85% cancellation risk) offering free early flight switches.
2. **AI Rebooking Assistant**: Evaluates alternatives and highlights passenger criteria (earliest arrival, window seats, fare class matching, on-time history) with natural language explanations.
3. **One-Click Recovery**: Simplifies flow from "Cancelled ➜ Rebook ➜ Confirm" to a single click "Accept & Rebook" card.
4. **Complete Journey Recovery**: Detects delay cascades (e.g., AMD ➜ DEL ➜ LHR). If Leg 1 causes a missed connection, it flags Leg 2 and suggests direct routing alternatives.
5. **AI Chatbot Assistant**: Natural language dialogue handling cancellations, refunds, seat swaps, and voucher credits with interactive quick-reply buttons.
6. **Intelligent Refund Engine**: Seamless selector for a 100% Cash Refund (expected in 4 days) or a 125% instant Travel Credit Voucher.
7. **Smart Push Notifications**: Mobile notification cards for reserved seats, delay alerts, and automatic refund fallbacks (e.g., 6h auto-refund trigger).
8. **Offline Digital Wallet**: Offline Airplane Mode caching. Boarding passes and travel details remain accessible without internet connectivity.
9. **Interactive SVG Seat Map**: Interactive seat grid coordinates highlighting Window, Aisle, and AI-recommended Extra Legroom seats.
10. **Dynamic Recovery Score**: Demo KPI widget showing recovery speed, customer support calls avoided, and cash saved for the airline.

### 🏢 Airline Operations & Control Room
11. **Live Airport Counters**: Operational metrics reporting Delayed flights, Cancelled flights, Passengers Waiting, Refund Requests, and Rebooked logs.
12. **AI Priority Queue**: Scores passenger vulnerability (Medical emergency, Elderly, Families, Connections, Booking class) out of 100, sorting them so staff help high-priority passengers first.
13. **AI Operations Planner**: Forecasts weather storm impacts, aircraft/crew shortages, gate conflicts, and runs an "AI Auto-Recovery Plan" batch rebooking action.
14. **Business Analytics & Charts**: CSS-rendered charts detailing customer CSAT (e.g., 4.85/5), average recovery times, delayed routes, and call avoidance.
15. **Personalization & Accessibility**: High-Contrast contrast profiles, font zoom levels (A-, A, A+), language selector (English, Hindi, Spanish), and a simulated Web Speech API screen reader with visual text readouts.

---

## 🛡️ CIA Triad Security Framework

Engineered with enterprise security compliance in mind:
* **Confidentiality (C)**: Role Gated Authentication. Passengers validate access via **PNR reference** & **Last Name** (e.g., PNR: `JTR982`, Name: `Sharma` signs in passenger Ankit). Airline Ops require secure corporate login credentials (`ops@jetrecovery.com`). Session locks prevent cross-switching.
* **Integrity (I)**: Ticket and reservation modifications output digital hashes representing cryptographically signed transaction payloads (`tx_signature: 0x8f...`).
* **Availability (A)**: LocalStorage synchronization caches flight wallets, ensuring critical boarding passes load under 0% network connectivity (Offline Mode).

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 19 + Vite 8
* **Styling**: Vanilla CSS3 Custom Variables (No Tailwind, custom glassmorphic tokens, CSS animations, and layout controls)
* **Iconography**: Lucide React
* **Speech Synthesis**: Web Speech API (`window.speechSynthesis` for screen reader simulation)
* **Database Caching**: LocalStorage
* **Language Support**: Internationalization state mapping (EN, HI, ES)

---

## 📦 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed:
```bash
node -v
npm -v
```

### 2. Installation
Clone your repository and install dependencies:
```bash
cd jetrecovery
npm install
```

### 3. Run Development Server
Start the local server:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 4. Run Automated Logic Tests
Run the integrity checks verifying priority calculations, recovery metrics, and scenario transitions:
```bash
node src/utils/verify.js
```

### 5. Production Build
Verify error-free bundling:
```bash
npm run build
```

---

## 🕹️ Active Demo Scenarios

Once the app is running, use the **Simulation Panel** at the top of the viewport to test operational conditions:
1. **Normal Ops**: Resets all state values. Flights are on-time.
2. **Delhi Storm**: Simulates severe weather at Delhi (DEL). Flight AI101 is cancelled, triggering passenger rebooking notifications, chatbot refund suggestions, and priority queue shifts.
3. **Leg 1 Tech Delay**: AI202 is delayed 3 hours in Ahmedabad, causing passenger Ankit Sharma to miss his Delhi-London connection. The system automatically prompts him to rebook onto a direct codeshare flight skipping Delhi.
4. **Simulate Offline**: Turns on simulated Airplane Mode. Disables rebooking edits but renders cached boarding tickets from the local storage wallet.
5. **Simulated Screen Reader**: Toggle **Voice On** in the Accessibility panel to hear dashboard events read aloud.

---

## 🏢 Demo Credentials

| Role | Username / ID | Password / Key |
| :--- | :--- | :--- |
| **Passenger View** | PNR: `JTR982` / Last Name: `Sharma` | *(No password required)* |
| **Airline Operations** | Email: `ops@jetrecovery.com` | Password: `admin` |
