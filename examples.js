/**
 * BARBADOS-ROOT PLATFORM EXAMPLES
 * Demonstrates usage of all four integrated components
 */

// ============================================================================
// EXAMPLE 1: Issue a Peacebond with Full Integrity
// ============================================================================

async function example1_IssuePeacebond() {
    console.log('=== EXAMPLE 1: Issue Peacebond ===');
    
    const result = await window.issuePeacebond({
        issuer: 'Wittfrida Foundation',
        purpose: 'Bio-Architecture Community Project',
        amount: 5000000, // 5M CR
        currency: 'CR',
        redemptionMechanism: 'frequency-based',
        location: 'South Tyrol',
        beneficiary: 'Local Community',
        conditions: [
            {
                type: 'frequency',
                minimumFrequency: 0.043
            },
            {
                type: 'peace_index',
                minimumPeaceIndex: 88.0
            },
            {
                type: 'time',
                afterDate: '2026-06-01T00:00:00Z'
            }
        ]
    });
    
    console.log('Peacebond ID:', result.peacebond.id);
    console.log('Blockchain Hash:', result.peacebond.blockchainHash);
    console.log('Integrity Seal:', result.integritySeal);
    console.log('Resonance Anchor ID:', result.peacebond.resonanceAnchorId);
    
    return result;
}

// ============================================================================
// EXAMPLE 2: Analyze a Dispute with AI Peace Platform
// ============================================================================

async function example2_AnalyzeDispute() {
    console.log('=== EXAMPLE 2: Analyze Dispute ===');
    
    const result = await window.analyzeDispute({
        parties: ['Community Group A', 'Development Corporation B'],
        description: 'Dispute over land use for bio-architecture vs. commercial development',
        urgent: false,
        scope: 'regional',
        partiesWilling: true,
        hasResources: true,
        historicalContext: 'Previous successful mediation in 2024'
    });
    
    console.log('Dispute ID:', result.analysis.id);
    console.log('Severity:', result.analysis.severity);
    console.log('Recommended Resolution:', result.analysis.recommendedResolution);
    console.log('ML Predictions:', result.analysis.mlPredictions);
    console.log('Peace Impact:', result.analysis.peaceImpact);
    console.log('Enforcement Check:', result.enforcement);
    
    if (result.peacebond) {
        console.log('Auto-generated Peacebond:', result.peacebond.peacebond.id);
    }
    
    console.log('Recommendations:', result.recommendations);
    
    return result;
}

// ============================================================================
// EXAMPLE 3: Create and Monitor Resonance Anchors
// ============================================================================

async function example3_ResonanceAnchors() {
    console.log('=== EXAMPLE 3: Resonance Anchors ===');
    
    // Access the platform instance
    const platform = window.barbadosRootPlatform;
    if (!platform) {
        console.error('Platform not initialized');
        return;
    }
    
    // Create a new anchor
    const anchor = platform.resonance.createAnchor({
        frequency: 0.043,
        location: 'LUMSA Campus',
        type: 'educational',
        strength: 0.95,
        creator: 'Resonance School',
        purpose: 'Academic knowledge preservation',
        nodes: ['LUMSA', 'ONNA'],
        rules: [
            {
                id: 'edu-001',
                type: 'frequency_bounds',
                min: 0.041,
                max: 0.045,
                severity: 'medium'
            },
            {
                id: 'edu-002',
                type: 'peace_threshold',
                minimumPeaceIndex: 85.0,
                severity: 'high'
            }
        ]
    });
    
    console.log('Anchor ID:', anchor.id);
    console.log('Nexus Alignment:', anchor.nexusAlignment);
    console.log('Status:', anchor.status);
    
    // Test subconscious enforcement
    const enforcement = platform.resonance.enforceSubconsciousRules({
        type: 'educational_activity',
        frequency: 0.043,
        peaceIndex: 89.3,
        availableNodes: ['LUMSA', 'ONNA', 'SUEDTIROL']
    });
    
    console.log('Rules Checked:', enforcement.rulesChecked);
    console.log('Violations:', enforcement.violations);
    console.log('Actions:', enforcement.actions);
    
    // Get Nexus status
    const nexusStatus = platform.resonance.getNexusStatus();
    console.log('Nexus Status:', nexusStatus);
    
    return { anchor, enforcement, nexusStatus };
}

// ============================================================================
// EXAMPLE 4: Integrity Checks and Validation
// ============================================================================

async function example4_IntegrityChecks() {
    console.log('=== EXAMPLE 4: Integrity Checks ===');
    
    const platform = window.barbadosRootPlatform;
    if (!platform) {
        console.error('Platform not initialized');
        return;
    }
    
    // Sample data to validate
    const importantData = {
        type: 'peace_treaty',
        parties: ['Nation Alpha', 'Nation Beta'],
        terms: ['Cease hostilities', 'Open trade', 'Cultural exchange'],
        signedDate: '2026-01-22T00:00:00Z',
        witnesses: ['Resonance School', 'Wittfrida Foundation']
    };
    
    // Create complete integrity seal
    const seal = await platform.integrity.createIntegritySeal(importantData);
    
    console.log('Integrity Seal Created:');
    console.log('- Seal ID:', seal.id);
    console.log('- SHA-256 Checksum:', seal.checksum);
    console.log('- Blockchain TX:', seal.blockchain.transactionHash);
    console.log('- Block Number:', seal.blockchain.blockNumber);
    console.log('- IPFS CID:', seal.ipfs.cid);
    console.log('- IPFS Gateways:', seal.ipfs.gateways);
    
    // Perform comprehensive integrity check
    const validation = await platform.integrity.performIntegrityCheck(
        importantData,
        {
            checksum: true,
            blockchain: true,
            ipfs: true,
            expectedChecksum: seal.checksum
        }
    );
    
    console.log('\nIntegrity Validation:');
    console.log('- Overall Status:', validation.overall.status);
    console.log('- Passed Checks:', validation.overall.passed);
    console.log('- Failed Checks:', validation.overall.failed);
    console.log('- Checksum Valid:', validation.checks.checksum?.valid);
    console.log('- Blockchain Verified:', validation.checks.blockchain?.valid);
    console.log('- IPFS Valid:', validation.checks.ipfs?.valid);
    
    return { seal, validation };
}

// ============================================================================
// EXAMPLE 5: Platform Health and Dashboard
// ============================================================================

async function example5_PlatformHealth() {
    console.log('=== EXAMPLE 5: Platform Health ===');
    
    const health = await window.getPlatformHealth();
    
    console.log('Overall Health:', health.overall);
    console.log('\nModule Status:');
    console.log('- Peacebonds:', health.modules.peacebonds.status, 
                `(${health.modules.peacebonds.active} active)`);
    console.log('- AI Peace:', health.modules.aiPeace.status,
                `(Peace Index: ${health.modules.aiPeace.globalPeaceIndex}%)`);
    console.log('- Resonance:', health.modules.resonance.status,
                `(Alignment: ${(health.modules.resonance.alignment * 100).toFixed(1)}%)`);
    console.log('- Integrity:', health.modules.integrity.status);
    
    console.log('\nMetrics:');
    console.log('- Total Peacebonds:', health.metrics.totalPeacebonds);
    console.log('- Active Disputes:', health.metrics.activeDisputes);
    console.log('- Active Anchors:', health.metrics.activeAnchors);
    console.log('- Integrity Records:', health.metrics.integrityRecords);
    
    // Get full dashboard data
    const dashboard = await window.getDashboard();
    
    console.log('\nDashboard Summary:');
    console.log('- Platform Status:', dashboard.summary.platformStatus);
    console.log('- Global Peace Index:', dashboard.summary.globalPeaceIndex);
    console.log('- Nexus Alignment:', dashboard.summary.nexusAlignment);
    console.log('- Active Peacebonds:', dashboard.summary.activePeacebonds);
    
    console.log('\nPeace Metrics:');
    console.log('- Global:', dashboard.peace.global);
    console.log('- Trend:', dashboard.peace.trend);
    console.log('- Nodes:', dashboard.peace.nodes);
    
    console.log('\nNexus Status:');
    console.log('- Status:', dashboard.nexus.status);
    console.log('- Frequency:', dashboard.nexus.frequency, 'Hz');
    console.log('- Connected Nodes:', dashboard.nexus.nodes);
    console.log('- Total Alignment:', dashboard.nexus.totalAlignment);
    
    return { health, dashboard };
}

// ============================================================================
// EXAMPLE 6: Complete Workflow - Issue Peacebond for Dispute Resolution
// ============================================================================

async function example6_CompleteWorkflow() {
    console.log('=== EXAMPLE 6: Complete Workflow ===');
    
    // Step 1: Analyze dispute
    console.log('\n1. Analyzing dispute...');
    const disputeAnalysis = await window.analyzeDispute({
        parties: ['Tech Startup Alpha', 'Traditional Business Beta'],
        description: 'IP rights dispute over AI-generated bio-materials design',
        urgent: true,
        scope: 'international',
        partiesWilling: true,
        hasResources: true
    });
    
    console.log('Dispute Severity:', disputeAnalysis.analysis.severity);
    console.log('Recommended Resolution:', disputeAnalysis.analysis.recommendedResolution.strategy);
    
    // Step 2: Issue peacebond for resolution
    console.log('\n2. Issuing peacebond for resolution...');
    const peacebondResult = await window.issuePeacebond({
        issuer: 'Barbados-Root AI Peace Platform',
        purpose: `Resolution fund for dispute ${disputeAnalysis.analysis.id}`,
        amount: 2000000, // 2M CR
        currency: 'CR',
        redemptionMechanism: 'resolution-based',
        beneficiary: 'Mutual Agreement',
        conditions: [
            {
                type: 'peace_index',
                minimumPeaceIndex: 92.0 // Higher than current
            },
            {
                type: 'time',
                afterDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
            }
        ]
    });
    
    console.log('Peacebond Created:', peacebondResult.peacebond.id);
    console.log('Integrity Sealed:', peacebondResult.integritySeal.verified);
    
    // Step 3: Check platform health after operations
    console.log('\n3. Checking platform health...');
    const health = await window.getPlatformHealth();
    console.log('Platform Status:', health.overall);
    console.log('Active Peacebonds:', health.modules.peacebonds.active);
    console.log('Peace Index:', health.modules.aiPeace.globalPeaceIndex);
    
    console.log('\n=== Workflow Complete ===');
    
    return {
        dispute: disputeAnalysis,
        peacebond: peacebondResult,
        health
    };
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

async function runAllExamples() {
    console.log('\n'.repeat(3));
    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║     BARBADOS-ROOT PLATFORM - COMPREHENSIVE EXAMPLES       ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');
    console.log('\n');
    
    try {
        // Wait for platform to be ready
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await example1_IssuePeacebond();
        console.log('\n' + '─'.repeat(60) + '\n');
        
        await example2_AnalyzeDispute();
        console.log('\n' + '─'.repeat(60) + '\n');
        
        await example3_ResonanceAnchors();
        console.log('\n' + '─'.repeat(60) + '\n');
        
        await example4_IntegrityChecks();
        console.log('\n' + '─'.repeat(60) + '\n');
        
        await example5_PlatformHealth();
        console.log('\n' + '─'.repeat(60) + '\n');
        
        await example6_CompleteWorkflow();
        console.log('\n' + '─'.repeat(60) + '\n');
        
        console.log('\n✅ All examples completed successfully!\n');
        
    } catch (error) {
        console.error('❌ Error running examples:', error);
    }
}

// Make functions available globally
window.barbadosExamples = {
    example1_IssuePeacebond,
    example2_AnalyzeDispute,
    example3_ResonanceAnchors,
    example4_IntegrityChecks,
    example5_PlatformHealth,
    example6_CompleteWorkflow,
    runAllExamples
};

console.log('\n📚 Barbados-Root Examples loaded!');
console.log('Run window.barbadosExamples.runAllExamples() to see all examples');
console.log('Or run individual examples like window.barbadosExamples.example1_IssuePeacebond()');
