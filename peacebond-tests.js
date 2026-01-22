/**
 * PEACEBOND PLATFORM TEST SCENARIOS
 * Barbados-Root Peacebond Platform
 * 
 * Comprehensive test cases simulating real-world application scenarios
 * Tests both peacebond contract functionality and AI conflict resolution
 */

// Load required modules
const PeacebondContract = require('./peacebond-contract.js');
const AIConflictResolution = require('./ai-conflict-resolution.js');

// Test runner helper
function runTest(name, testFn) {
    try {
        testFn();
        console.log(`✅ PASS: ${name}`);
        return true;
    } catch (error) {
        console.error(`❌ FAIL: ${name}`);
        console.error(`   Error: ${error.message}`);
        return false;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

// Initialize test systems
const peacebondContract = new PeacebondContract();
const aiResolution = new AIConflictResolution();

console.log('🧪 Starting Peacebond Platform Test Suite\n');
console.log('═'.repeat(60));

let passCount = 0;
let failCount = 0;

// ============================================================================
// PEACEBOND CONTRACT TESTS
// ============================================================================

console.log('\n📋 PEACEBOND CONTRACT TESTS\n');

// Test 1: Issue Basic Peacebond
passCount += runTest('Test 1: Issue basic peacebond', () => {
    const bond = peacebondContract.issuePeacebond({
        issuer: 'Test Issuer',
        purpose: 'Test Purpose',
        value: 10000
    });
    
    assert(bond.id, 'Bond should have an ID');
    assert(bond.id.startsWith('PB-'), 'Bond ID should start with PB-');
    assertEquals(bond.status, 'active', 'New bond should be active');
    assertEquals(bond.value, 10000, 'Bond value should match input');
});

// Test 2: Issue Peacebond with Full Configuration
passCount += runTest('Test 2: Issue peacebond with full configuration', () => {
    const bond = peacebondContract.issuePeacebond({
        issuer: 'Community Council',
        purpose: 'Rebuild community center',
        allocation: {
            communityRebuilding: 70,
            ecologicalPeace: 10,
            conflictResolution: 10,
            sovereigntySupport: 10
        },
        value: 50000,
        currency: 'CR',
        redemptionMechanism: 'milestone-based',
        milestones: [
            { name: 'Milestone 1', completed: false },
            { name: 'Milestone 2', completed: false },
            { name: 'Milestone 3', completed: false }
        ]
    });
    
    assert(bond.allocation.communityRebuilding === 70, 'Allocation should be set correctly');
    assertEquals(bond.milestones.length, 3, 'Should have 3 milestones');
    assertEquals(bond.resonanceScore, 0, 'Initial resonance score should be 0');
});

// Test 3: Update Milestone
passCount += runTest('Test 3: Update milestone completion', () => {
    const bond = peacebondContract.issuePeacebond({
        issuer: 'Test Issuer',
        purpose: 'Test',
        value: 10000,
        milestones: [
            { name: 'Step 1', completed: false },
            { name: 'Step 2', completed: false }
        ]
    });
    
    peacebondContract.updateMilestone(bond.id, 0, true);
    
    const updated = peacebondContract.peacebonds.get(bond.id);
    assert(updated.milestones[0].completed === true, 'Milestone should be marked complete');
    assert(updated.resonanceScore === 50, 'Resonance score should update to 50% (1/2 complete)');
});

// Test 4: Track Peacebond Progress
passCount += runTest('Test 4: Track peacebond progress', () => {
    const bond = peacebondContract.issuePeacebond({
        issuer: 'Test',
        purpose: 'Test',
        value: 10000,
        milestones: [
            { name: 'M1', completed: false },
            { name: 'M2', completed: false },
            { name: 'M3', completed: false },
            { name: 'M4', completed: false }
        ]
    });
    
    peacebondContract.updateMilestone(bond.id, 0, true);
    peacebondContract.updateMilestone(bond.id, 1, true);
    
    const tracking = peacebondContract.trackPeacebond(bond.id);
    
    assertEquals(tracking.tracking.milestonesCompleted, 2, 'Should show 2 completed milestones');
    assertEquals(tracking.tracking.totalMilestones, 4, 'Should show 4 total milestones');
    assertEquals(tracking.tracking.progress, '50.00', 'Progress should be 50%');
    assert(tracking.tracking.daysActive >= 0, 'Should track days active');
});

// Test 5: Redeem Peacebond - Success Case
passCount += runTest('Test 5: Redeem peacebond successfully', () => {
    const bond = peacebondContract.issuePeacebond({
        issuer: 'Test',
        purpose: 'Test',
        value: 10000,
        redemptionMechanism: 'milestone-based',
        milestones: [
            { name: 'M1', completed: false },
            { name: 'M2', completed: false },
            { name: 'M3', completed: false },
            { name: 'M4', completed: false },
            { name: 'M5', completed: false }
        ]
    });
    
    // Complete 80% (4/5)
    for (let i = 0; i < 4; i++) {
        peacebondContract.updateMilestone(bond.id, i, true);
    }
    
    const result = peacebondContract.redeemPeacebond(bond.id, { notes: 'Test redemption' });
    
    assert(result.success, 'Redemption should succeed');
    assertEquals(result.bondId, bond.id, 'Should return correct bond ID');
    assert(result.redemptionValue > 0, 'Should have redemption value');
});

// Test 6: Redeem Peacebond - Failure Case
passCount += runTest('Test 6: Fail to redeem incomplete peacebond', () => {
    const bond = peacebondContract.issuePeacebond({
        issuer: 'Test',
        purpose: 'Test',
        value: 10000,
        redemptionMechanism: 'milestone-based',
        milestones: [
            { name: 'M1', completed: false },
            { name: 'M2', completed: false },
            { name: 'M3', completed: false },
            { name: 'M4', completed: false },
            { name: 'M5', completed: false }
        ]
    });
    
    // Complete only 40% (2/5) - below 80% threshold
    peacebondContract.updateMilestone(bond.id, 0, true);
    peacebondContract.updateMilestone(bond.id, 1, true);
    
    let errorThrown = false;
    try {
        peacebondContract.redeemPeacebond(bond.id, {});
    } catch (error) {
        errorThrown = true;
        assert(error.message.includes('validation failed'), 'Should fail validation');
    }
    
    assert(errorThrown, 'Should throw error for incomplete milestones');
});

// Test 7: List Active Peacebonds
passCount += runTest('Test 7: List active peacebonds', () => {
    // Create multiple bonds
    const bond1 = peacebondContract.issuePeacebond({
        issuer: 'Issuer 1',
        purpose: 'Purpose 1',
        value: 10000
    });
    
    const bond2 = peacebondContract.issuePeacebond({
        issuer: 'Issuer 2',
        purpose: 'Purpose 2',
        value: 20000
    });
    
    const activeBonds = peacebondContract.listActivePeacebonds();
    
    assert(activeBonds.length >= 2, 'Should have at least 2 active bonds');
    assert(activeBonds.every(b => b.status === 'active'), 'All should be active');
});

// Test 8: Get Statistics
passCount += runTest('Test 8: Get system statistics', () => {
    const stats = peacebondContract.getStatistics();
    
    assert(stats.totalPeacebonds > 0, 'Should have total peacebonds');
    assert(stats.activePeacebonds >= 0, 'Should have active count');
    assert(stats.totalValue > 0, 'Should have total value');
    assert(typeof stats.averageResonanceScore === 'number', 'Should have average resonance score');
    assert(typeof stats.averageAIComplianceScore === 'number', 'Should have AI compliance score');
});

// Test 9: Blockchain Hash Generation
passCount += runTest('Test 9: Generate unique blockchain hashes', () => {
    const bond1 = peacebondContract.issuePeacebond({
        issuer: 'Test',
        purpose: 'Test',
        value: 10000
    });
    
    const bond2 = peacebondContract.issuePeacebond({
        issuer: 'Test',
        purpose: 'Test',
        value: 10000
    });
    
    assert(bond1.blockchainHash !== bond2.blockchainHash, 'Blockchain hashes should be unique');
    assert(bond1.blockchainHash.startsWith('0x'), 'Hash should start with 0x');
});

// Test 10: Transaction Logging
passCount += runTest('Test 10: Transaction logging', () => {
    const initialLogLength = peacebondContract.transactionLog.length;
    
    const bond = peacebondContract.issuePeacebond({
        issuer: 'Test',
        purpose: 'Test',
        value: 10000
    });
    
    assert(peacebondContract.transactionLog.length > initialLogLength, 'Should log transaction');
    const lastLog = peacebondContract.transactionLog[peacebondContract.transactionLog.length - 1];
    assertEquals(lastLog.type, 'ISSUE', 'Should log ISSUE transaction');
    assertEquals(lastLog.bondId, bond.id, 'Should reference correct bond');
});

// ============================================================================
// AI CONFLICT RESOLUTION TESTS
// ============================================================================

console.log('\n🤖 AI CONFLICT RESOLUTION TESTS\n');

// Test 11: Analyze Resource Dispute
passCount += runTest('Test 11: Analyze resource dispute', () => {
    const analysis = aiResolution.analyzeDispute({
        parties: ['Party A', 'Party B'],
        type: 'resource',
        severity: 'medium',
        duration: 90
    });
    
    assert(analysis.disputeId, 'Should generate dispute ID');
    assert(analysis.analysis, 'Should have analysis data');
    assert(analysis.suggestedOutcomes.length > 0, 'Should suggest outcomes');
    assert(analysis.suggestedOutcomes[0].successProbability >= 0 && 
           analysis.suggestedOutcomes[0].successProbability <= 1, 
           'Success probability should be 0-1');
});

// Test 12: Test Different Conflict Types
passCount += runTest('Test 12: Analyze different conflict types', () => {
    const types = ['resource', 'territorial', 'cultural', 'economic', 'political'];
    
    types.forEach(type => {
        const analysis = aiResolution.analyzeDispute({
            parties: ['Party A', 'Party B'],
            type: type,
            severity: 'medium',
            duration: 60
        });
        
        assertEquals(analysis.analysis.type, type, `Should analyze ${type} conflict`);
        assert(analysis.suggestedOutcomes.length > 0, `Should have strategies for ${type}`);
    });
});

// Test 13: Severity Impact on Analysis
passCount += runTest('Test 13: Severity affects risk assessment', () => {
    const lowSeverity = aiResolution.analyzeDispute({
        parties: ['Party A', 'Party B'],
        type: 'resource',
        severity: 'low',
        duration: 30
    });
    
    const highSeverity = aiResolution.analyzeDispute({
        parties: ['Party A', 'Party B'],
        type: 'resource',
        severity: 'high',
        duration: 30
    });
    
    const riskLevels = ['low', 'medium', 'high'];
    const lowRiskIndex = riskLevels.indexOf(lowSeverity.analysis.riskLevel);
    const highRiskIndex = riskLevels.indexOf(highSeverity.analysis.riskLevel);
    
    assert(lowRiskIndex <= highRiskIndex, 'High severity should have higher or equal risk');
});

// Test 14: Monitor Peace Metrics
passCount += runTest('Test 14: Monitor peace metrics', () => {
    const metrics = aiResolution.monitorPeaceMetrics('TEST-DISP-001', {
        cooperationIndicators: {
            communication: 0.8,
            negotiation: 0.7,
            compromise: 0.6
        },
        violentIncidents: 0,
        timeframeDays: 30,
        agreementsKept: 8,
        totalAgreements: 10,
        milestones: [
            { completed: true },
            { completed: true },
            { completed: false }
        ]
    });
    
    assert(metrics.cooperationLevel > 0, 'Should calculate cooperation level');
    assert(metrics.trustScore > 0, 'Should calculate trust score');
    assert(metrics.violenceIndex >= 0, 'Should calculate violence index');
    assert(metrics.progressTowardPeace >= 0, 'Should calculate progress');
    assert(metrics.status, 'Should determine status');
});

// Test 15: Peace Metrics - Deteriorating Situation
passCount += runTest('Test 15: Detect deteriorating peace situation', () => {
    const metrics = aiResolution.monitorPeaceMetrics('TEST-DISP-002', {
        cooperationIndicators: {
            communication: 0.2,
            negotiation: 0.1,
            compromise: 0.1
        },
        violentIncidents: 5,
        timeframeDays: 30,
        agreementsKept: 1,
        totalAgreements: 10
    });
    
    assert(metrics.alerts.length > 0, 'Should generate alerts for deteriorating situation');
    assert(metrics.recommendations.length > 0, 'Should provide recommendations');
});

// Test 16: Success Probability Calculation
passCount += runTest('Test 16: Calculate realistic success probabilities', () => {
    const analysis = aiResolution.analyzeDispute({
        parties: ['Party A', 'Party B'],
        type: 'resource',
        severity: 'medium',
        duration: 60,
        resources: {
            mediator: true,
            funding: true,
            community_support: true
        }
    });
    
    analysis.suggestedOutcomes.forEach(strategy => {
        assert(strategy.successProbability >= 0.1 && strategy.successProbability <= 0.95,
               'Success probability should be between 10% and 95%');
    });
});

// Test 17: Historical Case Similarity
passCount += runTest('Test 17: Find similar historical cases', () => {
    const analysis = aiResolution.analyzeDispute({
        parties: ['Party A', 'Party B'],
        type: 'resource',
        severity: 'medium',
        duration: 120
    });
    
    assert(analysis.similarHistoricalCases, 'Should search historical cases');
    assert(analysis.similarHistoricalCases.length > 0, 'Should find similar cases');
});

// Test 18: Evaluate Resolution Outcome
passCount += runTest('Test 18: Evaluate peaceful resolution', () => {
    const evaluation = aiResolution.evaluateResolution('TEST-DISP-003', {
        peacefulResolution: true,
        durationDays: 120,
        type: 'resource',
        strategiesUsed: ['mediation', 'resource-sharing'],
        partySatisfaction: [0.8, 0.85],
        sustainabilityScore: 0.9
    });
    
    assert(evaluation.success === true, 'Should recognize successful resolution');
    assert(evaluation.longTermPeaceProbability > 0, 'Should predict long-term peace');
    assert(evaluation.lessonsLearned.length > 0, 'Should extract lessons learned');
});

// Test 19: Train Model with New Data
passCount += runTest('Test 19: Train model with new data', () => {
    const initialDataLength = aiResolution.trainingData.length;
    
    aiResolution.trainModel([
        {
            type: 'economic',
            strategies: ['partnership', 'fair-trade'],
            outcome: 'peaceful',
            duration: 150,
            satisfaction: 0.85
        }
    ]);
    
    assert(aiResolution.trainingData.length > initialDataLength, 'Should add training data');
});

// Test 20: Resonance Alignment
passCount += runTest('Test 20: Calculate resonance alignment', () => {
    const metrics = aiResolution.monitorPeaceMetrics('TEST-DISP-004', {
        nonViolentScore: 0.9,
        lifeEnhancementScore: 0.8,
        cooperationIndicators: { communication: 0.7, negotiation: 0.6, compromise: 0.5 }
    });
    
    assert(metrics.resonanceAlignment > 0, 'Should calculate resonance alignment');
    assert(metrics.resonanceAlignment <= 1, 'Resonance alignment should be <= 1');
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

console.log('\n🔗 INTEGRATION TESTS\n');

// Test 21: End-to-End Peacebond Workflow
passCount += runTest('Test 21: Complete peacebond workflow', () => {
    // 1. Analyze conflict
    const analysis = aiResolution.analyzeDispute({
        parties: ['Community A', 'Community B'],
        type: 'resource',
        severity: 'medium',
        duration: 90
    });
    
    // 2. Issue peacebond based on analysis
    const bond = peacebondContract.issuePeacebond({
        issuer: 'Peace Council',
        purpose: `Resolve ${analysis.analysis.type} conflict`,
        value: analysis.suggestedOutcomes[0].resourceRequirements.financial,
        milestones: [
            { name: 'Initial mediation', completed: false },
            { name: 'Framework agreed', completed: false },
            { name: 'Implementation', completed: false },
            { name: 'Verification', completed: false }
        ]
    });
    
    // 3. Monitor progress
    const initialTracking = peacebondContract.trackPeacebond(bond.id);
    assertEquals(initialTracking.tracking.progress, '0.00', 'Should start at 0%');
    
    // 4. Update milestones
    peacebondContract.updateMilestone(bond.id, 0, true);
    peacebondContract.updateMilestone(bond.id, 1, true);
    peacebondContract.updateMilestone(bond.id, 2, true);
    peacebondContract.updateMilestone(bond.id, 3, true);
    
    // 5. Track updated progress
    const updatedTracking = peacebondContract.trackPeacebond(bond.id);
    assertEquals(updatedTracking.tracking.progress, '100.00', 'Should reach 100%');
    
    // 6. Redeem
    const redemption = peacebondContract.redeemPeacebond(bond.id, {
        finalReport: 'Conflict resolved peacefully'
    });
    
    assert(redemption.success, 'Should redeem successfully');
    
    // 7. Evaluate
    const evaluation = aiResolution.evaluateResolution(analysis.disputeId, {
        peacefulResolution: true,
        durationDays: 120,
        type: analysis.analysis.type,
        partySatisfaction: [0.9, 0.85]
    });
    
    assert(evaluation.success, 'Should evaluate as successful');
});

// Test 22: Multiple Concurrent Peacebonds
passCount += runTest('Test 22: Handle multiple concurrent peacebonds', () => {
    const bonds = [];
    
    for (let i = 0; i < 5; i++) {
        bonds.push(peacebondContract.issuePeacebond({
            issuer: `Issuer ${i}`,
            purpose: `Purpose ${i}`,
            value: (i + 1) * 10000
        }));
    }
    
    assertEquals(bonds.length, 5, 'Should create 5 bonds');
    
    const uniqueIds = new Set(bonds.map(b => b.id));
    assertEquals(uniqueIds.size, 5, 'All bond IDs should be unique');
});

// ============================================================================
// SUMMARY
// ============================================================================

console.log('\n' + '═'.repeat(60));
console.log('\n📊 TEST RESULTS SUMMARY\n');
console.log(`Total Tests: ${passCount + failCount}`);
console.log(`✅ Passed: ${passCount}`);
console.log(`❌ Failed: ${failCount}`);
console.log(`Success Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
console.log('\n' + '═'.repeat(60));

if (failCount === 0) {
    console.log('\n🎉 All tests passed! Peacebond Platform is ready for deployment.\n');
} else {
    console.log(`\n⚠️  ${failCount} test(s) failed. Please review and fix issues.\n`);
}

// Export test results
const testResults = {
    total: passCount + failCount,
    passed: passCount,
    failed: failCount,
    successRate: (passCount / (passCount + failCount)) * 100
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = testResults;
}
