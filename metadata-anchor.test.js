/**
 * Test Suite for Metadata Anchoring System
 * 
 * Tests binary metadata anchoring, IPFS validation, blockchain timestamping,
 * and node synchronization functionality.
 */

// Import the module (works in both Node.js and browser environments)
const MetadataAnchor = typeof window !== 'undefined' && window.MetadataAnchor 
    ? window.MetadataAnchor 
    : require('./metadata-anchor.js');

/**
 * Simple test runner
 */
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
        console.log('\n🧪 Running Metadata Anchor Tests...\n');
        
        for (const test of this.tests) {
            try {
                await test.fn();
                this.passed++;
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.failed++;
                console.log(`❌ ${test.name}`);
                console.error(`   Error: ${error.message}`);
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`Tests Passed: ${this.passed}`);
        console.log(`Tests Failed: ${this.failed}`);
        console.log(`Total Tests: ${this.tests.length}`);
        console.log('='.repeat(50) + '\n');

        return this.failed === 0;
    }
}

/**
 * Assertion helper
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

/**
 * Test Suite
 */
async function runTests() {
    const runner = new TestRunner();

    // Test 1: Initialize MetadataAnchor
    runner.test('Initialize MetadataAnchor with default config', () => {
        const anchor = new MetadataAnchor();
        assert(anchor.config.hashAlgorithm === 'sha256', 'Default hash algorithm should be sha256');
        assert(anchor.config.blockchainNetwork === 'mainnet', 'Default network should be mainnet');
        assert(Array.isArray(anchor.anchors), 'Anchors should be an array');
    });

    // Test 2: Initialize with custom config
    runner.test('Initialize MetadataAnchor with custom config', () => {
        const anchor = new MetadataAnchor({
            ipfsGateway: 'https://custom.ipfs.gateway/',
            blockchainNetwork: 'testnet'
        });
        assert(anchor.config.ipfsGateway === 'https://custom.ipfs.gateway/', 'Custom IPFS gateway set');
        assert(anchor.config.blockchainNetwork === 'testnet', 'Custom blockchain network set');
    });

    // Test 3: Generate metadata hash
    runner.test('Generate metadata hash', async () => {
        const anchor = new MetadataAnchor();
        const data = { test: 'data', value: 123 };
        const hash = await anchor.generateMetadataHash(data);
        
        assert(typeof hash === 'string', 'Hash should be a string');
        assert(hash.length === 64, 'SHA-256 hash should be 64 characters');
        assert(/^[0-9a-f]+$/.test(hash), 'Hash should be hexadecimal');
    });

    // Test 4: Hash consistency
    runner.test('Hash consistency for identical data', async () => {
        const anchor = new MetadataAnchor();
        const data = { test: 'data', value: 123 };
        const hash1 = await anchor.generateMetadataHash(data);
        const hash2 = await anchor.generateMetadataHash(data);
        
        assert(hash1 === hash2, 'Same data should produce same hash');
    });

    // Test 5: Hash uniqueness
    runner.test('Hash uniqueness for different data', async () => {
        const anchor = new MetadataAnchor();
        const data1 = { test: 'data1' };
        const data2 = { test: 'data2' };
        const hash1 = await anchor.generateMetadataHash(data1);
        const hash2 = await anchor.generateMetadataHash(data2);
        
        assert(hash1 !== hash2, 'Different data should produce different hashes');
    });

    // Test 6: Validate IPFS CID v0
    runner.test('Validate IPFS CIDv0 format', () => {
        const anchor = new MetadataAnchor();
        const validCID = 'QmResonanceSchoolTruth20251226HannesMitterer';
        const invalidCID = 'InvalidCID123';
        
        assert(anchor.validateIPFSCID(validCID), 'Valid CIDv0 should pass validation');
        assert(!anchor.validateIPFSCID(invalidCID), 'Invalid CID should fail validation');
    });

    // Test 7: Validate various IPFS CID formats
    runner.test('Validate various IPFS CID formats', () => {
        const anchor = new MetadataAnchor();
        
        // CIDv0 example
        const cidv0 = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';
        assert(anchor.validateIPFSCID(cidv0), 'CIDv0 should be valid');
        
        // Invalid formats
        assert(!anchor.validateIPFSCID(''), 'Empty string should be invalid');
        assert(!anchor.validateIPFSCID('Qm123'), 'Too short CID should be invalid');
    });

    // Test 8: Anchor with IPFS
    runner.test('Anchor metadata with IPFS', async () => {
        const anchor = new MetadataAnchor();
        const metadata = { title: 'Test Document', version: '1.0' };
        const ipfsCID = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';
        
        const result = await anchor.anchorWithIPFS(metadata, ipfsCID);
        
        assert(result.hash, 'Anchor should have hash');
        assert(result.ipfsCID === ipfsCID, 'Anchor should contain IPFS CID');
        assert(result.validated === true, 'Valid CID should be marked as validated');
        assert(result.type === 'ipfs', 'Type should be ipfs');
        assert(result.timestamp, 'Anchor should have timestamp');
    });

    // Test 9: Create blockchain timestamp
    runner.test('Create blockchain timestamp', async () => {
        const anchor = new MetadataAnchor();
        const hash = await anchor.generateMetadataHash({ test: 'data' });
        const blockchainData = {
            blockNumber: 12345678,
            txHash: '0xabc123',
            confirmed: true
        };
        
        const timestamp = await anchor.createBlockchainTimestamp(hash, blockchainData);
        
        assert(timestamp.hash === hash, 'Timestamp should contain hash');
        assert(timestamp.blockNumber === 12345678, 'Block number should match');
        assert(timestamp.txHash === '0xabc123', 'Transaction hash should match');
        assert(timestamp.confirmed === true, 'Should be marked as confirmed');
        assert(timestamp.type === 'blockchain', 'Type should be blockchain');
    });

    // Test 10: Synchronize nodes
    runner.test('Synchronize metadata across nodes', async () => {
        const anchor = new MetadataAnchor();
        const nodes = ['NODE_01', 'NODE_02', 'NODE_03', 'NODE_04'];
        const metadata = { protocol: 'Resonance School', version: '1.0' };
        
        const result = await anchor.synchronizeNodes(nodes, metadata);
        
        assert(result.totalNodes === 4, 'Should sync to 4 nodes');
        assert(result.successfulSyncs === 4, 'All syncs should succeed');
        assert(result.nodes.length === 4, 'Should have 4 node results');
        assert(result.hash, 'Should have metadata hash');
        
        // Check individual node results
        result.nodes.forEach(node => {
            assert(node.status === 'synced', 'Each node should be synced');
            assert(node.latency > 0, 'Each node should have latency');
        });
    });

    // Test 11: Verify immutability
    runner.test('Verify metadata immutability', async () => {
        const anchor = new MetadataAnchor();
        const originalData = { test: 'data', value: 123 };
        const originalHash = await anchor.generateMetadataHash(originalData);
        
        // Same data should verify
        const sameData = { test: 'data', value: 123 };
        const isImmutable1 = await anchor.verifyImmutability(originalHash, sameData);
        assert(isImmutable1, 'Same data should verify as immutable');
        
        // Different data should not verify
        const differentData = { test: 'data', value: 456 };
        const isImmutable2 = await anchor.verifyImmutability(originalHash, differentData);
        assert(!isImmutable2, 'Different data should not verify as immutable');
    });

    // Test 12: Get anchors by hash
    runner.test('Get anchors by hash', async () => {
        const anchor = new MetadataAnchor();
        const metadata = { test: 'data' };
        const hash = await anchor.generateMetadataHash(metadata);
        
        // Create multiple anchors
        await anchor.anchorWithIPFS(metadata, 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
        await anchor.createBlockchainTimestamp(hash, { confirmed: true });
        
        const anchors = anchor.getAnchors(hash);
        assert(anchors.length === 2, 'Should have 2 anchors for this hash');
    });

    // Test 13: Get governance status
    runner.test('Get governance protocol status', async () => {
        const anchor = new MetadataAnchor();
        const metadata = { test: 'data' };
        
        await anchor.anchorWithIPFS(metadata, 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
        await anchor.anchorWithIPFS(metadata, 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
        
        const status = anchor.getGovernanceStatus();
        
        assert(status.totalAnchors > 0, 'Should have anchors');
        assert(status.ipfsAnchors > 0, 'Should have IPFS anchors');
        assert(status.validatedIPFS > 0, 'Should have validated IPFS anchors');
        assert(typeof status.integrityScore === 'string', 'Integrity score should be a string');
        assert(parseFloat(status.integrityScore) >= 0, 'Integrity score should be non-negative');
    });

    // Test 14: Comprehensive anchor creation
    runner.test('Create comprehensive anchor', async () => {
        const anchor = new MetadataAnchor();
        const data = {
            title: 'Resonance School Protocol',
            version: '1.0.0',
            timestamp: new Date().toISOString()
        };
        
        const record = await anchor.createComprehensiveAnchor(data, {
            ipfsCID: 'QmResonanceSchoolTruth20251226HannesMitterer',
            blockchain: true,
            nodes: ['NODE_01', 'NODE_02', 'NODE_03']
        });
        
        assert(record.hash, 'Record should have hash');
        assert(record.timestamp, 'Record should have timestamp');
        assert(record.data, 'Record should have data');
        assert(record.anchors.ipfs, 'Record should have IPFS anchor');
        assert(record.anchors.blockchain, 'Record should have blockchain anchor');
        assert(record.anchors.nodes, 'Record should have node sync info');
    });

    // Test 15: Export state
    runner.test('Export complete state', async () => {
        const anchor = new MetadataAnchor();
        const metadata = { test: 'data' };
        
        await anchor.anchorWithIPFS(metadata, 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
        
        const state = anchor.exportState();
        
        assert(state.config, 'Export should include config');
        assert(Array.isArray(state.anchors), 'Export should include anchors');
        assert(state.metadata, 'Export should include metadata');
        assert(state.governanceStatus, 'Export should include governance status');
        assert(state.exportTimestamp, 'Export should have timestamp');
    });

    // Run all tests
    const success = await runner.run();
    
    // Exit with appropriate code for CI/CD
    if (typeof process !== 'undefined' && process.exit) {
        process.exit(success ? 0 : 1);
    }
    
    return success;
}

// Run tests
if (typeof module !== 'undefined' && require.main === module) {
    runTests();
}

// Export for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runTests, TestRunner, assert };
}
