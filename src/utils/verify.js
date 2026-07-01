// Automated state transition and logic test for JetRecovery SaaS
import {
  INITIAL_FLIGHTS,
  INITIAL_PASSENGERS,
  calculatePriorityScore,
  calculateRecoveryScore,
  SCENARIOS
} from "./SimulationEngine.js";

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`  ✓ ${message}`);
  }
}

console.log("=== JETRECOVERY SAAS: AUTOMATED INTEGRITY TESTS ===");

// 1. Check Data Integrities
assert(INITIAL_FLIGHTS.length === 5, "Database must initialize exactly 5 flights");
assert(INITIAL_PASSENGERS.length === 6, "Database must initialize exactly 6 passengers");

// 2. Check Priority Scores Calculations (Feature 8)
const paxRajesh = INITIAL_PASSENGERS.find(p => p.id === "PAX003"); // Medical
const scoreRajesh = calculatePriorityScore(paxRajesh);
assert(scoreRajesh === 98, `Medical passenger priority must be 98 (got ${scoreRajesh})`);

const paxPriya = INITIAL_PASSENGERS.find(p => p.id === "PAX006"); // Normal Economy
const scorePriya = calculatePriorityScore(paxPriya);
assert(scorePriya === 40, `Normal Economy passenger priority must be 40 (got ${scorePriya})`);

const paxAnkit = INITIAL_PASSENGERS.find(p => p.id === "PAX001"); // Connecting Business
const scoreAnkit = calculatePriorityScore(paxAnkit);
assert(scoreAnkit === 80, `Connecting Business passenger priority must be 80 (got ${scoreAnkit})`);

console.log("\n--- Priority Queue Sorting Test ---");
const sorted = [...INITIAL_PASSENGERS].sort((a, b) => {
  const sa = calculatePriorityScore(a);
  const sb = calculatePriorityScore(b);
  return sb - sa;
});
assert(sorted[0].id === "PAX003", `Highest priority passenger must be PAX003 (Rajesh), got ${sorted[0].id}`);
assert(sorted[1].id === "PAX002", `Second priority passenger must be PAX002 (Sarah), got ${sorted[1].id}`);

// 3. Check Recovery Efficiency Score Metrics (Feature 15)
const perfectScore = calculateRecoveryScore(paxAnkit, 30, false);
assert(perfectScore === 100, `Fast recovery with no offline should score 100, got ${perfectScore}`);

const delayedOfflineScore = calculateRecoveryScore(paxAnkit, 350, true);
assert(delayedOfflineScore < 90, `Slow recovery with offline issues must score lower (<90), got ${delayedOfflineScore}`);

// 4. Scenario State Transitions Checks (Features 1 & 14)
console.log("\n--- Scenario Transition Tests ---");
const storm = SCENARIOS.STORM_DELHI;
const affectedFlight101 = storm.flightsUpdates.find(u => u.id === "AI101");
const affectedFlight102 = storm.flightsUpdates.find(u => u.id === "AI102");

assert(affectedFlight101.status === "Cancelled", "Delhi Storm must set AI101 status to Cancelled");
assert(affectedFlight102.riskScore === 85, "Delhi Storm must trigger 85% risk score on AI102");

console.log("\n=== ALL AUTOMATED BUSINESS INTELLIGENCE CHECKS PASSED! ===");
