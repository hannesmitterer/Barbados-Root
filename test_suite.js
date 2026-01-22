/**
 * Test Suite for Barbados Root System
 * Tests all integrated modules
 */

// Simple test framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    test(name, fn) {
        this.tests.push({ name, fn });
    }
    
    async run() {
        console.log('\n=== Running Barbados Root System Tests ===\n');
        
        for (const test of this.tests) {
            try {
                await test.fn();
                this.passed++;
                console.log(`✓ ${test.name}`);
            } catch (error) {
                this.failed++;
                console.error(`✗ ${test.name}`);
                console.error(`  Error: ${error.message}`);
            }
        }
        
        console.log('\n=== Test Summary ===');
        console.log(`Passed: ${this.passed}`);
        console.log(`Failed: ${this.failed}`);
        console.log(`Total: ${this.tests.length}`);
        console.log(`Success Rate: ${((this.passed / this.tests.length) * 100).toFixed(1)}%\n`);
        
        return this.failed === 0;
    }
}

// Helper assertion function
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

// Initialize test runner
const runner = new TestRunner();

// ========================================
// Euystacio Lock Tests
// ========================================

runner.test('Euystacio Lock - Initialize', () => {
    const lock = new EuystacioLock();
    assert(lock.OFFSET_0100 === 0x0100, 'OFFSET_0100 should be 0x0100');
    assert(lock.OFFSET_0110 === 0x0110, 'OFFSET_0110 should be 0x0110');
    assert(lock.state.resonanceFrequency === 0.043, 'Default resonance should be 0.043');
});

runner.test('Euystacio Lock - Engage Lock', () => {
    const lock = new EuystacioLock();
    const result = lock.engagePressureLock(300.0, 321.5);
    assert(result.locked === true, 'Lock should engage with pressure differential');
    assert(result.offset === 0x0100, 'Should use OFFSET 0100');
});

runner.test('Euystacio Lock - Calculate Resonance Parameters', () => {
    const lock = new EuystacioLock();
    const params = lock.calculateResonanceParameters();
    assert(params.offset === 0x0110, 'Should use OFFSET 0110');
    assert(params.frequency === 0.043, 'Should have correct frequency');
    assert(typeof params.drift === 'number', 'Should calculate drift');
});

runner.test('Euystacio Lock - Measure Buffer Integrity', () => {
    const lock = new EuystacioLock();
    const integrity = lock.measureBufferIntegrity();
    assert(integrity > 0, 'Integrity should be positive');
    assert(integrity <= 100, 'Integrity should not exceed 100');
});

// ========================================
// NSR Binary Logic Tests
// ========================================

runner.test('NSR - Initialize', () => {
    const nsr = new NSRBinaryLogic();
    assert(nsr.OFFSET_0120 === 0x0120, 'OFFSET_0120 should be 0x0120');
    assert(nsr.state.nsrActive === true, 'NSR should be active by default');
    assert(nsr.state.driftLevel === 0.000, 'Initial drift should be 0.000');
});

runner.test('NSR - Enforce Compliant Action', () => {
    const nsr = new NSRBinaryLogic();
    const result = nsr.enforce({
        removesAutonomy: false,
        forcesCompliance: false,
        hasExplanation: true,
        isAuditable: true,
        biocompatible: true,
        harmful: false,
        allowsVeto: true,
        irreversible: false,
        exploitative: false,
        hasConsent: true
    });
    assert(result.allowed === true, 'Compliant action should be allowed');
    assert(result.violations.length === 0, 'Should have no violations');
});

runner.test('NSR - Block Non-Compliant Action', () => {
    const nsr = new NSRBinaryLogic();
    const result = nsr.enforce({
        removesAutonomy: true, // Violates autonomy
        forcesCompliance: false,
        hasExplanation: true,
        isAuditable: true,
        biocompatible: true,
        harmful: false,
        allowsVeto: true,
        irreversible: false,
        exploitative: false,
        hasConsent: true
    });
    assert(result.allowed === false, 'Non-compliant action should be blocked');
    assert(result.violations.length > 0, 'Should have violations');
});

runner.test('NSR - Audit', () => {
    const nsr = new NSRBinaryLogic();
    const audit = nsr.audit();
    assert(audit.nsrActive === true, 'NSR should be active');
    assert(typeof audit.drift === 'number', 'Should have drift value');
    assert(typeof audit.integrity === 'number', 'Should have integrity value');
});

runner.test('NSR - Execute Veto', () => {
    const nsr = new NSRBinaryLogic();
    const veto = nsr.executeVeto('ACTION_123', 'Human override');
    assert(veto.success === true, 'Veto should succeed');
    assert(veto.offset === 0x0120, 'Should use OFFSET 0120');
});

// ========================================
// VB_BRIDGE Tests
// ========================================

runner.test('VB_BRIDGE - Initialize', () => {
    const bridge = new VBBridge();
    assert(bridge.OFFSET_0130 === 0x0130, 'OFFSET_0130 should be 0x0130');
    assert(bridge.state.totalNodes === 144000, 'Should have 144000 total nodes');
    assert(Object.keys(bridge.nodes).length === 4, 'Should have 4 registered nodes');
});

runner.test('VB_BRIDGE - Synchronize Data', () => {
    const bridge = new VBBridge();
    const result = bridge.synchronize({ test: 'data' });
    assert(result.offset === 0x0130, 'Should use OFFSET 0130');
    assert(Array.isArray(result.results), 'Should have results array');
});

runner.test('VB_BRIDGE - Calculate Resilience', () => {
    const bridge = new VBBridge();
    const resilience = bridge.calculateResilienceFactor();
    assert(typeof resilience === 'number', 'Resilience should be a number');
    assert(resilience >= 0 && resilience <= 100, 'Resilience should be 0-100');
});

runner.test('VB_BRIDGE - Register Node', () => {
    const bridge = new VBBridge();
    const result = bridge.registerNode('NODE_TEST', {
        name: 'TEST_NODE',
        role: 'Testing'
    });
    assert(result.success === true, 'Node registration should succeed');
    assert(bridge.nodes['NODE_TEST'] !== undefined, 'Node should be registered');
});

// ========================================
// Resonance Enforcement Tests
// ========================================

runner.test('Resonance - Create Immutable Header', () => {
    const enforcement = new ResonanceEnforcement();
    const result = enforcement.createImmutableHeader({
        test: 'metadata'
    });
    assert(result.immutable === true, 'Header should be immutable');
    assert(result.header.signature !== null, 'Header should have signature');
});

runner.test('Resonance - Verify Authenticity', () => {
    const enforcement = new ResonanceEnforcement();
    const header = enforcement.createImmutableHeader({ test: 'data' });
    const verification = enforcement.verifyAuthenticity(
        { frequency: 0.043 },
        header.headerId
    );
    assert(verification.authentic === true, 'Should verify authentic signal');
});

runner.test('Resonance - Measure Integrity', () => {
    const enforcement = new ResonanceEnforcement();
    enforcement.createImmutableHeader({ test: 'data' });
    const integrity = enforcement.measureIntegrity();
    assert(integrity === 100.0, 'Fresh headers should have 100% integrity');
});

// ========================================
// IPFS Validator Tests
// ========================================

runner.test('IPFS - Validate CID Format', () => {
    const validator = new IPFSValidator();
    const result = validator.validateCID('QmResonanceSchoolTruth20251226HannesMitterer');
    assert(result.valid === true, 'Valid CID should pass');
    assert(result.matches === true, 'Should match expected CID');
});

runner.test('IPFS - Invalid CID Format', () => {
    const validator = new IPFSValidator();
    const result = validator.validateCID('InvalidCID123');
    assert(result.valid === false, 'Invalid CID should fail');
});

runner.test('IPFS - Validate Node Connectivity', async () => {
    const validator = new IPFSValidator();
    const result = await validator.validateNodeConnectivity({
        id: 'NODE_01',
        status: 'online',
        peers: 5
    });
    assert(result.connected === true, 'Online node should be connected');
    assert(result.sufficientPeers === true, 'Should have sufficient peers');
});

// ========================================
// Blockchain Verifier Tests
// ========================================

runner.test('Blockchain - Verify Timestamp', () => {
    const verifier = new BlockchainVerifier();
    const now = Date.now();
    const result = verifier.verifyTimestamp(now, now, 1000);
    assert(result.valid === true, 'Matching timestamps should verify');
});

runner.test('Blockchain - Verify Transaction Hash', () => {
    const verifier = new BlockchainVerifier();
    const validHash = '0x' + '1234567890abcdef'.repeat(4);
    const result = verifier.verifyTransactionHash(validHash);
    assert(result.valid === true, 'Valid tx hash should pass');
});

runner.test('Blockchain - Verify Address', () => {
    const verifier = new BlockchainVerifier();
    const result = verifier.verifyAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2');
    assert(result.valid === true, 'Valid address should pass');
    assert(result.matchesTreasury === true, 'Should match treasury address');
});

runner.test('Blockchain - Verify Timelock', () => {
    const verifier = new BlockchainVerifier();
    const result = verifier.verifyTimelock(Date.now());
    assert(typeof result.timelockPassed === 'boolean', 'Should have timelock status');
});

// ========================================
// Crypto Integrity Tests
// ========================================

runner.test('Crypto - Generate Checksum', async () => {
    const crypto = new CryptoIntegrityChecker();
    const result = await crypto.generateChecksum({ test: 'data' }, 'TEST_ID');
    assert(result.checksum !== null, 'Should generate checksum');
    assert(result.identifier === 'TEST_ID', 'Should store identifier');
});

runner.test('Crypto - Verify Integrity', async () => {
    const crypto = new CryptoIntegrityChecker();
    const data = { test: 'data' };
    await crypto.generateChecksum(data, 'TEST_ID');
    const result = await crypto.verifyIntegrity(data, 'TEST_ID');
    assert(result.valid === true, 'Matching data should verify');
});

runner.test('Crypto - Detect Tampering', async () => {
    const crypto = new CryptoIntegrityChecker();
    const originalData = { test: 'data' };
    await crypto.generateChecksum(originalData, 'TEST_ID');
    const tamperedData = { test: 'modified' };
    const result = await crypto.verifyIntegrity(tamperedData, 'TEST_ID');
    assert(result.valid === false, 'Tampered data should fail verification');
});

// ========================================
// Integrated System Tests
// ========================================

runner.test('System - Initialize', async () => {
    const system = new BarbadosRootSystem();
    const result = await system.initialize();
    assert(result.success === true, 'System should initialize successfully');
    assert(system.state.initialized === true, 'System state should be initialized');
});

runner.test('System - Health Check', async () => {
    const system = new BarbadosRootSystem();
    await system.initialize();
    const health = await system.performHealthCheck();
    assert(health.overall !== null, 'Should have overall health status');
    assert(health.components !== undefined, 'Should have component health');
});

runner.test('System - Execute Action', async () => {
    const system = new BarbadosRootSystem();
    await system.initialize();
    const result = await system.executeAction({
        id: 'TEST_ACTION',
        type: 'TEST',
        removesAutonomy: false,
        forcesCompliance: false,
        hasExplanation: true,
        isAuditable: true,
        biocompatible: true,
        harmful: false,
        allowsVeto: true,
        irreversible: false,
        exploitative: false,
        hasConsent: true
    });
    assert(result.success === true, 'Compliant action should execute');
    assert(result.nsrCompliant === true, 'Should be NSR compliant');
});

runner.test('System - Get Dashboard', async () => {
    const system = new BarbadosRootSystem();
    await system.initialize();
    const dashboard = await system.getDashboard();
    assert(dashboard.system !== undefined, 'Should have system info');
    assert(dashboard.euystacioLock !== undefined, 'Should have lock info');
    assert(dashboard.nsr !== undefined, 'Should have NSR info');
    assert(dashboard.vbBridge !== undefined, 'Should have bridge info');
});

// Export runner for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = runner;
}

// Export for browser usage
if (typeof window !== 'undefined') {
    window.TestRunner = runner;
    window.runTests = () => runner.run();
}
