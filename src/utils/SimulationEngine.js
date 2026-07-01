// Simulation Engine & Mock Data for JetRecovery SaaS

export const INITIAL_FLIGHTS = [
  {
    id: "AI202",
    number: "AI202",
    origin: "AMD",
    destination: "DEL",
    depTime: "Today 18:30",
    arrTime: "Today 20:00",
    status: "On Time", // On Time, Delayed, Cancelled
    delayMinutes: 0,
    riskScore: 12, // percentage risk of cancellation
    onTimeHistory: 94,
    aircraft: "Airbus A320neo",
    gate: "A4",
    crewStatus: "Ready",
  },
  {
    id: "AI101",
    number: "AI101",
    origin: "DEL",
    destination: "LHR",
    depTime: "Today 22:15",
    arrTime: "Tomorrow 03:30",
    status: "On Time",
    delayMinutes: 0,
    riskScore: 18,
    onTimeHistory: 88,
    aircraft: "Boeing 787-9 Dreamliner",
    gate: "B12",
    crewStatus: "Ready",
  },
  {
    // Alternative 1
    id: "AI305",
    number: "AI305",
    origin: "DEL",
    destination: "LHR",
    depTime: "Tomorrow 08:00",
    arrTime: "Tomorrow 13:15",
    status: "Scheduled",
    delayMinutes: 0,
    riskScore: 10,
    onTimeHistory: 90,
    aircraft: "Boeing 787-9 Dreamliner",
    gate: "B14",
    seatsLeft: 8,
    fareClassMatch: "Yes (Business & Economy)",
    explanation: "Recommended: Earliest departure tomorrow, same class (Business), window seat available, and 90% historical on-time performance.",
    seatsMap: [
      { id: "12A", type: "Window", status: "Available", price: 0, extraLegroom: true },
      { id: "12B", type: "Middle", status: "Occupied", price: 0 },
      { id: "12C", type: "Aisle", status: "Available", price: 0 },
      { id: "14A", type: "Window", status: "Available", price: 0 },
      { id: "14B", type: "Middle", status: "Available", price: 0 },
      { id: "14C", type: "Aisle", status: "Occupied", price: 0 },
      { id: "15A", type: "Window", status: "Occupied", price: 0, extraLegroom: true },
      { id: "15B", type: "Middle", status: "Available", price: 0 },
      { id: "15C", type: "Aisle", status: "Available", price: 0, extraLegroom: true },
    ],
  },
  {
    // Alternative 2
    id: "AI102",
    number: "AI102",
    origin: "DEL",
    destination: "LHR",
    depTime: "Tomorrow 12:00",
    arrTime: "Tomorrow 17:15",
    status: "Scheduled",
    delayMinutes: 0,
    riskScore: 15,
    onTimeHistory: 85,
    aircraft: "Boeing 777-300ER",
    gate: "B18",
    seatsLeft: 22,
    fareClassMatch: "Yes",
    explanation: "Later alternative, good if you need more transition time in Delhi. Heavy flight load.",
    seatsMap: [
      { id: "18A", type: "Window", status: "Available", price: 0 },
      { id: "18B", type: "Middle", status: "Available", price: 0 },
      { id: "18C", type: "Aisle", status: "Available", price: 0 },
    ],
  },
  {
    // Direct Alternative AMD -> LHR via codeshare
    id: "EY256",
    number: "EY256",
    origin: "AMD",
    destination: "LHR",
    depTime: "Tomorrow 04:30",
    arrTime: "Tomorrow 11:45",
    status: "Scheduled",
    delayMinutes: 0,
    riskScore: 5,
    onTimeHistory: 95,
    aircraft: "Boeing 787-10",
    gate: "C2",
    seatsLeft: 3,
    fareClassMatch: "Yes",
    explanation: "Direct codeshare flight skipping Delhi entirely. Highly recommended to avoid weather delays in Delhi.",
    seatsMap: [
      { id: "8A", type: "Window", status: "Available", price: 0, extraLegroom: true },
      { id: "8C", type: "Aisle", status: "Occupied", price: 0, extraLegroom: true },
    ],
  }
];

export const INITIAL_PASSENGERS = [
  {
    id: "PAX001",
    name: "Ankit Sharma",
    age: 28,
    class: "Business",
    category: "Connecting", // Connecting, Elderly, Medical, Family, Normal
    phone: "+91 98765 43210",
    email: "ankit.sharma@saas.com",
    journey: [
      { flight: "AI202", origin: "AMD", dest: "DEL", seat: "2D", status: "On Time" },
      { flight: "AI101", origin: "DEL", dest: "LHR", seat: "3K", status: "On Time" }
    ],
    urgencyText: "Business Meeting in London tomorrow morning",
    needsAssistance: false,
    priorityScore: 80, // Dynamic
    recoveryStatus: "Untouched", // Untouched, Warning, Offered, Rebooked, Refunded, Voucher
    recoveryTime: null,
    recoveryScore: 100,
    rebookedFlight: null,
    rebookedSeat: null,
    refundAmount: 7845,
    refundType: null, // Cash, Credit
    notified: false,
  },
  {
    id: "PAX002",
    name: "Sarah Jenkins",
    age: 82,
    class: "Economy",
    category: "Elderly",
    phone: "+44 7700 900077",
    email: "s.jenkins@uknet.co.uk",
    journey: [
      { flight: "AI101", origin: "DEL", dest: "LHR", seat: "28A", status: "On Time" }
    ],
    urgencyText: "Returning home, requires wheelchair assistance",
    needsAssistance: true,
    priorityScore: 95,
    recoveryStatus: "Untouched",
    recoveryTime: null,
    recoveryScore: 100,
    rebookedFlight: null,
    rebookedSeat: null,
    refundAmount: 5120,
    refundType: null,
    notified: false,
  },
  {
    id: "PAX003",
    name: "Dr. Rajesh Patel",
    age: 45,
    class: "Economy",
    category: "Medical",
    phone: "+91 99988 77766",
    email: "rajesh.patel@med.org",
    journey: [
      { flight: "AI101", origin: "DEL", dest: "LHR", seat: "15C", status: "On Time" }
    ],
    urgencyText: "Flying for urgent medical consultation in London",
    needsAssistance: true,
    priorityScore: 98,
    recoveryStatus: "Untouched",
    recoveryTime: null,
    recoveryScore: 100,
    rebookedFlight: null,
    rebookedSeat: null,
    refundAmount: 6450,
    refundType: null,
    notified: false,
  },
  {
    id: "PAX004",
    name: "Maria Gomez & Infant",
    age: 31,
    class: "Economy",
    category: "Family",
    phone: "+34 600 123 456",
    email: "maria.gomez@gmail.com",
    journey: [
      { flight: "AI101", origin: "DEL", dest: "LHR", seat: "32E", status: "On Time" }
    ],
    urgencyText: "Traveling with 8-month-old infant, needs bassinet",
    needsAssistance: true,
    priorityScore: 88,
    recoveryStatus: "Untouched",
    recoveryTime: null,
    recoveryScore: 100,
    rebookedFlight: null,
    rebookedSeat: null,
    refundAmount: 5800,
    refundType: null,
    notified: false,
  },
  {
    id: "PAX005",
    name: "John Davis",
    age: 50,
    class: "First",
    category: "Normal",
    phone: "+1 202 555 0143",
    email: "jdavis@corp.com",
    journey: [
      { flight: "AI101", origin: "DEL", dest: "LHR", seat: "1A", status: "On Time" }
    ],
    urgencyText: "Premium high-value customer",
    needsAssistance: false,
    priorityScore: 75,
    recoveryStatus: "Untouched",
    recoveryTime: null,
    recoveryScore: 100,
    rebookedFlight: null,
    rebookedSeat: null,
    refundAmount: 18500,
    refundType: null,
    notified: false,
  },
  {
    id: "PAX006",
    name: "Priya Nair",
    age: 22,
    class: "Economy",
    category: "Normal",
    phone: "+91 94470 12345",
    email: "priya.nair@univ.edu",
    journey: [
      { flight: "AI101", origin: "DEL", dest: "LHR", seat: "41F", status: "On Time" }
    ],
    urgencyText: "Student returning for term start",
    needsAssistance: false,
    priorityScore: 40,
    recoveryStatus: "Untouched",
    recoveryTime: null,
    recoveryScore: 100,
    rebookedFlight: null,
    rebookedSeat: null,
    refundAmount: 4900,
    refundType: null,
    notified: false,
  }
];

// Helper to calculate Priority Score based on passenger criteria
export function calculatePriorityScore(passenger) {
  let score = 40; // base score

  // Class factor
  if (passenger.class === "First") score += 35;
  if (passenger.class === "Business") score += 15;

  // Category factor
  if (passenger.category === "Medical") score += 48;
  if (passenger.category === "Elderly") score += 45;
  if (passenger.category === "Family") score += 38;
  if (passenger.category === "Connecting") score += 25;

  // Needs assistance factor
  if (passenger.needsAssistance) score += 10;

  return Math.min(100, score);
}

// Helper to calculate Dynamic Recovery Score
// Target is high score (100 is perfect). Deducts for delay and manual touches
export function calculateRecoveryScore(passenger, rebookTimeSeconds = 120, offlineInvolved = false) {
  let score = 100;

  // Time taken to resolve (simulated)
  if (rebookTimeSeconds > 300) {
    score -= 15; // slow recovery
  } else if (rebookTimeSeconds > 60) {
    score -= 5;
  }

  // Action status deductions
  if (passenger.recoveryStatus === "Refunded") {
    score -= 10; // refund is a loss of sale, lower satisfaction than successful rebook
  }
  
  if (passenger.recoveryStatus === "Voucher") {
    score -= 5;
  }

  if (offlineInvolved) {
    score -= 8; // minor friction
  }

  return Math.max(30, score);
}

// Scenarios Definitions
export const SCENARIOS = {
  DEFAULT: {
    name: "Normal Operations",
    description: "All flights are operating on time. Risk scores are low.",
    weather: "Clear Skies (28°C)",
    airportStatus: "Normal Operations",
    flightsUpdates: [
      { id: "AI202", status: "On Time", delayMinutes: 0, riskScore: 12 },
      { id: "AI101", status: "On Time", delayMinutes: 0, riskScore: 18 }
    ],
    logs: ["System initialized. Monitoring airspace weather.", "All flight paths clear."]
  },
  STORM_DELHI: {
    name: "Delhi Storm Detected",
    description: "Severe dust storm hitting Indira Gandhi International (DEL). Incoming flights delayed, outgoing grounded.",
    weather: "Dust Storm & High Winds (18 kts)",
    airportStatus: "Severe Disruptions",
    flightsUpdates: [
      { id: "AI101", status: "Cancelled", delayMinutes: 0, riskScore: 100 },
      { id: "AI202", status: "Delayed", delayMinutes: 90, riskScore: 65 },
      { id: "AI102", status: "Delayed", delayMinutes: 180, riskScore: 85 }
    ],
    logs: [
      "CRITICAL: Dust storm alert issued for Delhi (DEL). Visibility < 200m.",
      "Flight AI101 cancelled due to weather closure.",
      "Flight AI202 delayed 90 mins; airspace stacking active.",
      "Proactive alerts triggered for Delhi-departing passengers.",
      "Automated queue re-sorting: 5 passengers queued for priority recovery."
    ]
  },
  AMD_DELAY: {
    name: "Ahmedabad Incoming Delay",
    description: "Mechanical issue on AI202 in Ahmedabad (AMD). Expected 3-hour delay, breaking Delhi connection.",
    weather: "Clear (32°C)",
    airportStatus: "Normal (DEL), Tech Delay (AMD)",
    flightsUpdates: [
      { id: "AI202", status: "Delayed", delayMinutes: 180, riskScore: 90 },
      { id: "AI101", status: "On Time", delayMinutes: 0, riskScore: 15 }
    ],
    logs: [
      "TECHNICAL ALERT: AI202 (AMD-DEL) reports auxiliary power unit failure. Delay set to 180 mins.",
      "AI connection monitoring: Passenger Ankit Sharma will miss connection AI101 (DEL-LHR) by 45 mins.",
      "AI Rebooking triggered for Ankit Sharma (AMD -> DEL -> LHR missed connection).",
      "Alternative search initiated: Codeshare EY256 (AMD-LHR direct) locked for priority option."
    ]
  },
  CREW_SHORTAGE: {
    name: "Crew Shortage in Ahmedabad",
    description: "Crew hours limit reached. AI202 cancelled.",
    weather: "Overcast (29°C)",
    airportStatus: "Crew Conflict",
    flightsUpdates: [
      { id: "AI202", status: "Cancelled", delayMinutes: 0, riskScore: 100 }
    ],
    logs: [
      "OPERATIONS ALERT: Crew duty limits reached for AI202 flight deck. No backup crew available in AMD.",
      "Flight AI202 CANCELLED.",
      "Priority Queue updated. Connecting passenger Ankit Sharma stranded in Ahmedabad."
    ]
  }
};
