/**
 * BARBADOS ROOT - Integration Tests
 * 
 * Test cases validating the synchronization between all layers
 * and sovereignty states.
 */

// Load modules if in Node.js environment
let ShythiaBlock, EuystacioAI, ApolloInterface, BarbadosRootIntegration;
if (typeof require !== 'undefined') {
    ShythiaBlock = require('./shythia-block.js');
    EuystacioAI = require('./euystacio-ai.js');
    ApolloInterface = require('./apollo-interface.js');
    const integration = require('./barbados-integration.js');
    BarbadosRootIntegration = integration.BarbadosRootIntegration;
}

// Simple test framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }
    
    test(name, fn) {
        this.tests.push({ name, fn });
    }
    
    async run() {
        console.log('='.repeat(60));
        console.log('BARBADOS ROOT INTEGRATION TESTS');
        console.log('='.repeat(60));
        console.log('');
        
        for (const test of this.tests) {
            this.results.total++;
            try {
                await test.fn();
                this.results.passed++;
                console.log(`✓ ${test.name}`);
            } catch (error) {
                this.results.failed++;
                console.log(`✗ ${test.name}`);
                console.log(`  Error: ${error.message}`);
            }
        }
        
        console.log('');
        console.log('='.repeat(60));
        console.log(`Results: ${this.results.passed}/${this.results.total} passed`);
        if (this.results.failed > 0) {
            console.log(`         ${this.results.failed} failed`);
        }
        console.log('='.repeat(60));
        
        return this.results.failed === 0;
    }
}

// Assertion helpers
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

function assertGreaterThan(actual, threshold, message) {
    if (actual <= threshold) {
        throw new Error(message || `Expected > ${threshold}, got ${actual}`);
    }
}

function assertExists(value, message) {
    if (value === null || value === undefined) {
        throw new Error(message || 'Value does not exist');
    }
}

// Test suite
const runner = new TestRunner();

// Shythia Block Tests
runner.test('Shythia Block - Initialization', () => {
    const shythia = new ShythiaBlock({ sovereignNode: 'TEST-NODE' });
    assertExists(shythia, 'ShythiaBlock instance should exist');
    assertEquals(shythia.config.sovereignNode, 'TEST-NODE', 'Sovereign node should be TEST-NODE');
});

runner.test('Shythia Block - Transaction Addition', () => {
    const shythia = new ShythiaBlock();
    const txId = shythia.addTransaction({
        from: 'Alice',
        to: 'Bob',
        amount: 100
    });
    
    assertExists(txId, 'Transaction ID should be returned');
    assert(txId.startsWith('TX-'), 'Transaction ID should have TX- prefix');
    assertEquals(shythia.metrics.totalTransactions, 1, 'Total transactions should be 1');
});

runner.test('Shythia Block - Block Sealing', () => {
    const shythia = new ShythiaBlock();
    
    // Add transactions
    for (let i = 0; i < 5; i++) {
        shythia.addTransaction({ from: 'A', to: 'B', amount: i });
    }
    
    const block = shythia.sealBlock();
    assertExists(block, 'Block should be created');
    assertEquals(block.transactionCount, 5, 'Block should contain 5 transactions');
    assertExists(block.blockHash, 'Block should have a hash');
});

runner.test('Shythia Block - Integrity Check', () => {
    const shythia = new ShythiaBlock();
    
    // Add and seal some blocks
    for (let i = 0; i < 3; i++) {
        shythia.addTransaction({ data: `tx-${i}` });
        shythia.sealBlock();
    }
    
    const report = shythia.performIntegrityCheck();
    assertExists(report, 'Integrity report should exist');
    assert(report.chainValid, 'Chain should be valid');
    assertEquals(report.integrityScore, 100, 'Integrity score should be 100');
});

runner.test('Shythia Block - Metrics Reporting', () => {
    const shythia = new ShythiaBlock();
    shythia.addTransaction({ data: 'test' });
    
    const metrics = shythia.getMetrics();
    assertExists(metrics, 'Metrics should exist');
    assertExists(metrics.totalTransactions, 'Should have totalTransactions');
    assertExists(metrics.integrityScore, 'Should have integrityScore');
});

// Euystacio-AI Tests
runner.test('Euystacio-AI - Initialization', () => {
    const euystacio = new EuystacioAI({ sovereignNode: 'TEST-NODE' });
    assertExists(euystacio, 'EuystacioAI instance should exist');
    assert(euystacio.config.lexAmorisEnabled, 'Lex Amoris should be enabled by default');
});

runner.test('Euystacio-AI - Decision Processing', () => {
    const euystacio = new EuystacioAI();
    const decision = euystacio.processDecision({
        action: 'test',
        transparent: true,
        harm: 0
    });
    
    assertExists(decision, 'Decision should be returned');
    assertExists(decision.id, 'Decision should have ID');
    assert(decision.approved, 'Decision should be approved for valid request');
});

runner.test('Euystacio-AI - Sovereignty Check (High Stakes)', () => {
    const euystacio = new EuystacioAI({ autonomyThreshold: 0.9 });
    euystacio.state.autonomyScore = 0.85; // Below threshold
    
    const decision = euystacio.processDecision({
        stakes: 'high',
        action: 'test'
    });
    
    assert(!decision.approved, 'High-stakes decision should be rejected with low autonomy');
});

runner.test('Euystacio-AI - Lex Amoris Violation Detection', () => {
    const euystacio = new EuystacioAI({ lexAmorisEnabled: true });
    const decision = euystacio.processDecision({
        action: 'harmful',
        harm: 0.8, // Harmful action
        transparent: true
    });
    
    assert(!decision.approved, 'Harmful decision should be rejected');
    assertEquals(decision.reason, 'Lex Amoris violation', 'Should cite Lex Amoris violation');
});

runner.test('Euystacio-AI - State Reporting', () => {
    const euystacio = new EuystacioAI();
    const state = euystacio.getState();
    
    assertExists(state, 'State should exist');
    assertExists(state.autonomyScore, 'Should have autonomy score');
    assertExists(state.intelligence, 'Should have intelligence metrics');
    assertGreaterThan(state.autonomyScore, 0, 'Autonomy score should be positive');
});

// Apollo Interface Tests
runner.test('Apollo Interface - Initialization', () => {
    const apollo = new ApolloInterface({ sovereignNode: 'TEST-NODE' });
    assertExists(apollo, 'ApolloInterface instance should exist');
    assertEquals(apollo.config.sovereignNode, 'TEST-NODE', 'Sovereign node should be TEST-NODE');
});

runner.test('Apollo Interface - Module Injection', () => {
    const shythia = new ShythiaBlock();
    const euystacio = new EuystacioAI();
    const apollo = new ApolloInterface();
    
    apollo.injectModules({ shythiaBlock: shythia, euystacioAI: euystacio });
    
    assertExists(apollo.shythiaBlock, 'ShythiaBlock should be injected');
    assertExists(apollo.euystacioAI, 'EuystacioAI should be injected');
});

runner.test('Apollo Interface - Dashboard Generation', () => {
    const shythia = new ShythiaBlock();
    const euystacio = new EuystacioAI();
    const apollo = new ApolloInterface();
    apollo.injectModules({ shythiaBlock: shythia, euystacioAI: euystacio });
    
    const dashboard = apollo.getDashboard();
    
    assertExists(dashboard, 'Dashboard should exist');
    assertExists(dashboard.blockchain, 'Should include blockchain metrics');
    assertExists(dashboard.ai, 'Should include AI metrics');
    assertExists(dashboard.alignment, 'Should include alignment metrics');
});

runner.test('Apollo Interface - Visualization Data', () => {
    const apollo = new ApolloInterface();
    const vizData = apollo.getVisualizationData();
    
    assertExists(vizData, 'Visualization data should exist');
    assertExists(vizData.aiBlockchainBridge, 'Should include AI-blockchain bridge');
    assertExists(vizData.sovereigntyState, 'Should include sovereignty state');
    assertExists(vizData.nodeNetwork, 'Should include node network');
});

runner.test('Apollo Interface - Alignment Metrics', () => {
    const shythia = new ShythiaBlock();
    const euystacio = new EuystacioAI();
    const apollo = new ApolloInterface();
    apollo.injectModules({ shythiaBlock: shythia, euystacioAI: euystacio });
    
    apollo.updateAlignmentMetrics();
    const state = apollo.getState();
    
    assertExists(state.alignmentMetrics, 'Alignment metrics should exist');
    assertGreaterThan(state.alignmentMetrics.aiBlockchainSync, 0, 'AI-blockchain sync should be positive');
});

// Integration Tests
runner.test('Integration - System Initialization', () => {
    const system = new BarbadosRootIntegration({ sovereignNode: 'TEST-NODE' });
    
    assertExists(system, 'Integration system should exist');
    assertExists(system.shythiaBlock, 'Should have ShythiaBlock');
    assertExists(system.euystacioAI, 'Should have EuystacioAI');
    assertExists(system.apolloInterface, 'Should have ApolloInterface');
});

runner.test('Integration - Transaction Processing', () => {
    const system = new BarbadosRootIntegration();
    
    const result = system.processTransaction({
        from: 'Alice',
        to: 'Bob',
        amount: 100,
        transparent: true,
        harm: 0
    });
    
    assertExists(result, 'Result should exist');
    assert(result.success, 'Transaction should succeed');
    assertExists(result.transactionId, 'Should have transaction ID');
    assertExists(result.aiDecisionId, 'Should have AI decision ID');
});

runner.test('Integration - System Status', () => {
    const system = new BarbadosRootIntegration();
    const status = system.getSystemStatus();
    
    assertExists(status, 'Status should exist');
    assertExists(status.modules, 'Should have module statuses');
    assertExists(status.modules.shythia, 'Should have Shythia status');
    assertExists(status.modules.euystacio, 'Should have Euystacio status');
    assertExists(status.modules.apollo, 'Should have Apollo status');
});

runner.test('Integration - System Health Calculation', () => {
    const system = new BarbadosRootIntegration();
    
    // Process some transactions to generate activity
    for (let i = 0; i < 3; i++) {
        system.processTransaction({
            from: 'A',
            to: 'B',
            amount: i * 100,
            transparent: true,
            harm: 0
        });
    }
    
    const status = system.getSystemStatus();
    
    assertExists(status.systemHealth, 'System health should exist');
    assertGreaterThan(status.systemHealth.score, 0.5, 'Health score should be > 0.5');
    assertExists(status.systemHealth.status, 'Should have health status');
});

runner.test('Integration - Synchronization Validation', () => {
    const system = new BarbadosRootIntegration();
    
    // Process transaction
    system.processTransaction({
        from: 'Alice',
        to: 'Bob',
        amount: 1000,
        transparent: true,
        harm: 0
    });
    
    const shythiaMetrics = system.shythiaBlock.getMetrics();
    const euystacioState = system.euystacioAI.getState();
    const apolloDashboard = system.apolloInterface.getDashboard();
    
    // Verify all layers have data
    assertGreaterThan(shythiaMetrics.totalTransactions, 0, 'Blockchain should have transactions');
    assertGreaterThan(euystacioState.decisionCount, 0, 'AI should have decisions');
    assertExists(apolloDashboard.blockchain, 'Dashboard should show blockchain data');
    assertExists(apolloDashboard.ai, 'Dashboard should show AI data');
});

runner.test('Integration - Sovereignty State Transitions', () => {
    const system = new BarbadosRootIntegration();
    const apollo = system.apolloInterface;
    
    const sovereigntyBefore = apollo.computeSovereigntyState();
    assertExists(sovereigntyBefore, 'Initial sovereignty state should exist');
    
    // Process multiple transactions
    for (let i = 0; i < 5; i++) {
        system.processTransaction({
            from: 'A',
            to: 'B',
            amount: 100,
            transparent: true,
            harm: 0
        });
    }
    
    const sovereigntyAfter = apollo.computeSovereigntyState();
    assertExists(sovereigntyAfter, 'Final sovereignty state should exist');
    assertExists(sovereigntyAfter.status, 'Should have sovereignty status');
});

// Run all tests
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runner, TestRunner };
} else {
    // Run tests if in browser or Node.js direct execution
    runner.run().then(success => {
        if (typeof process !== 'undefined') {
            process.exit(success ? 0 : 1);
        }
    });
}
