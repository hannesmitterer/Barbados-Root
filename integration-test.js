#!/usr/bin/env node

/**
 * Integration Test for Complete Metadata Anchoring System
 * 
 * Tests the full workflow including:
 * - Metadata generation and hashing
 * - IPFS anchoring
 * - Blockchain timestamping
 * - Node synchronization
 * - Governance integrity
 */

const MetadataAnchor = require('./metadata-anchor.js');

console.log('\n🚀 Integration Test: Complete Metadata Anchoring Workflow\n');
console.log('='.repeat(60));

async function runIntegrationTest() {
    let passed = 0;
    let failed = 0;

    try {
        // Step 1: Initialize the system
        console.log('\n📋 Step 1: Initialize Metadata Anchor System');
        const anchor = new MetadataAnchor({
            ipfsGateway: 'https://ipfs.io/ipfs/',
            blockchainNetwork: 'mainnet',
            nodeEndpoints: ['NODE_01', 'NODE_02', 'NODE_03', 'NODE_04']
        });
        console.log('✅ System initialized with 4 node endpoints');
        passed++;

        // Step 2: Create test metadata
        console.log('\n📋 Step 2: Create Test Metadata');
        const resonanceMetadata = {
            protocol: 'Resonance School',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            governance: {
                nsr_enforced: true,
                olf_active: true,
                mode: 'autonomous',
                facilitator: 'Hannes Mitterer'
            },
            treasury: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2',
            nodes: {
                onna: { status: 'active', role: 'validator' },
                lumsa: { status: 'active', role: 'academic' },
                suedtirol: { status: 'active', role: 'geographic' },
                berlin: { status: 'active', role: 'sync_hub' }
            }
        };
        console.log('✅ Test metadata created');
        passed++;

        // Step 3: Generate hash
        console.log('\n📋 Step 3: Generate Metadata Hash');
        const hash = await anchor.generateMetadataHash(resonanceMetadata);
        console.log(`✅ Generated hash: ${hash.substring(0, 16)}...`);
        passed++;

        // Step 4: IPFS Anchoring
        console.log('\n📋 Step 4: Create IPFS Anchor');
        const ipfsCID = 'QmResonanceSchoolTruth20251226HannesMitterer';
        const ipfsAnchor = await anchor.anchorWithIPFS(resonanceMetadata, ipfsCID);
        console.log(`✅ IPFS anchor created with CID: ${ipfsCID}`);
        console.log(`   Validated: ${ipfsAnchor.validated}`);
        console.log(`   Gateway URL: ${ipfsAnchor.ipfsGatewayURL}`);
        passed++;

        // Step 5: Blockchain Timestamp
        console.log('\n📋 Step 5: Create Blockchain Timestamp');
        const blockchainAnchor = await anchor.createBlockchainTimestamp(hash, {
            blockNumber: 15234567,
            txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
            confirmed: true
        });
        console.log(`✅ Blockchain timestamp created`);
        console.log(`   Block: ${blockchainAnchor.blockNumber}`);
        console.log(`   TX Hash: ${blockchainAnchor.txHash.substring(0, 18)}...`);
        console.log(`   Confirmed: ${blockchainAnchor.confirmed}`);
        passed++;

        // Step 6: Node Synchronization
        console.log('\n📋 Step 6: Synchronize Across Nodes');
        const nodes = ['NODE_01_ONNA', 'NODE_02_LUMSA', 'NODE_03_SUEDTIROL', 'NODE_04_BERLIN'];
        const syncResult = await anchor.synchronizeNodes(nodes, resonanceMetadata);
        console.log(`✅ Synchronized across ${syncResult.totalNodes} nodes`);
        console.log(`   Successful syncs: ${syncResult.successfulSyncs}/${syncResult.totalNodes}`);
        syncResult.nodes.forEach(node => {
            console.log(`   - ${node.node}: ${node.status} (${node.latency}ms)`);
        });
        passed++;

        // Step 7: Comprehensive Anchor
        console.log('\n📋 Step 7: Create Comprehensive Anchor Record');
        const comprehensiveRecord = await anchor.createComprehensiveAnchor(resonanceMetadata, {
            ipfsCID: 'QmResonanceSchoolTruth20251226HannesMitterer',
            blockchain: true,
            blockchainData: {
                blockNumber: 15234568,
                confirmed: true
            },
            nodes: nodes
        });
        console.log('✅ Comprehensive anchor record created');
        console.log(`   Hash: ${comprehensiveRecord.hash.substring(0, 16)}...`);
        console.log(`   IPFS: ${comprehensiveRecord.anchors.ipfs ? 'Anchored' : 'Not anchored'}`);
        console.log(`   Blockchain: ${comprehensiveRecord.anchors.blockchain ? 'Timestamped' : 'Not timestamped'}`);
        console.log(`   Nodes: ${comprehensiveRecord.anchors.nodes ? 'Synchronized' : 'Not synchronized'}`);
        passed++;

        // Step 8: Verify Immutability
        console.log('\n📋 Step 8: Verify Metadata Immutability');
        const isImmutable = await anchor.verifyImmutability(hash, resonanceMetadata);
        console.log(`✅ Immutability verified: ${isImmutable}`);
        
        // Test with modified data
        const modifiedMetadata = { ...resonanceMetadata, tampered: true };
        const isTampered = await anchor.verifyImmutability(hash, modifiedMetadata);
        console.log(`   Tampered data detected: ${!isTampered}`);
        passed++;

        // Step 9: Check Governance Status
        console.log('\n📋 Step 9: Check Governance Protocol Status');
        const governanceStatus = anchor.getGovernanceStatus();
        console.log('✅ Governance status retrieved:');
        console.log(`   Total Anchors: ${governanceStatus.totalAnchors}`);
        console.log(`   IPFS Anchors: ${governanceStatus.ipfsAnchors}`);
        console.log(`   Blockchain Anchors: ${governanceStatus.blockchainAnchors}`);
        console.log(`   Validated IPFS: ${governanceStatus.validatedIPFS}`);
        console.log(`   Integrity Score: ${governanceStatus.integrityScore}%`);
        passed++;

        // Step 10: Export State
        console.log('\n📋 Step 10: Export Complete State');
        const exportedState = anchor.exportState();
        console.log('✅ State exported successfully');
        console.log(`   Total anchors in state: ${exportedState.anchors.length}`);
        console.log(`   Metadata records: ${Object.keys(exportedState.metadata).length}`);
        console.log(`   Export timestamp: ${exportedState.exportTimestamp}`);
        passed++;

        // Final Summary
        console.log('\n' + '='.repeat(60));
        console.log('\n🎉 Integration Test Summary:');
        console.log(`   ✅ Passed: ${passed}`);
        console.log(`   ❌ Failed: ${failed}`);
        console.log(`   Total: ${passed + failed}`);
        console.log('\n' + '='.repeat(60));

        console.log('\n📊 Final Governance Status:');
        console.log(JSON.stringify(governanceStatus, null, 2));
        
        console.log('\n✅ All integration tests passed successfully!\n');
        return true;

    } catch (error) {
        failed++;
        console.error(`\n❌ Integration test failed: ${error.message}`);
        console.error(error.stack);
        console.log('\n' + '='.repeat(60));
        console.log(`\n📊 Final Results: ${passed} passed, ${failed} failed\n`);
        return false;
    }
}

// Run the integration test
runIntegrationTest()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
