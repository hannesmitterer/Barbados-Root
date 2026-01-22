/**
 * PEACEBOND INITIALIZATION SCRIPT
 * Barbados-Root Peacebond Platform
 * 
 * Initializes the peacebond system with example data and demonstrates functionality
 */

// Import modules (in browser, these are loaded via script tags)
const initializePeacebondSystem = () => {
    console.log('🌍 Initializing Peacebond System...');

    // Initialize contract and AI modules
    const peacebondContract = new PeacebondContract();
    const aiResolution = new AIConflictResolution();

    // Example 1: Community Rebuilding Peacebond
    console.log('\n📋 Creating Example Peacebond #1: Community Rebuilding');
    const bond1 = peacebondContract.issuePeacebond({
        issuer: 'Bridgetown Community Council',
        purpose: 'Rebuild community center damaged by recent storms',
        allocation: {
            communityRebuilding: 60,
            ecologicalPeace: 20,
            conflictResolution: 10,
            sovereigntySupport: 10
        },
        value: 50000,
        currency: 'CR',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        redemptionMechanism: 'milestone-based',
        milestones: [
            { name: 'Design approved by community', completed: false },
            { name: 'Foundation laid', completed: false },
            { name: 'Structure built', completed: false },
            { name: 'Interior completed', completed: false },
            { name: 'Community activities resumed', completed: false }
        ]
    });
    console.log(`✅ Created: ${bond1.id} - ${bond1.purpose}`);

    // Example 2: Ecological Peace Peacebond
    console.log('\n📋 Creating Example Peacebond #2: Ecological Restoration');
    const bond2 = peacebondContract.issuePeacebond({
        issuer: 'Barbados Ecological Alliance',
        purpose: 'Restore coastal mangroves for climate resilience',
        allocation: {
            communityRebuilding: 10,
            ecologicalPeace: 70,
            conflictResolution: 10,
            sovereigntySupport: 10
        },
        value: 75000,
        currency: 'CR',
        expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(), // 2 years
        redemptionMechanism: 'milestone-based',
        milestones: [
            { name: 'Coastal survey completed', completed: true },
            { name: '1000 mangrove seedlings planted', completed: true },
            { name: 'Community education program launched', completed: false },
            { name: '5000 total mangroves established', completed: false },
            { name: 'Biodiversity increase documented', completed: false }
        ]
    });
    console.log(`✅ Created: ${bond2.id} - ${bond2.purpose}`);

    // Example 3: Conflict Resolution Peacebond
    console.log('\n📋 Creating Example Peacebond #3: Trade Dispute Resolution');
    const bond3 = peacebondContract.issuePeacebond({
        issuer: 'Caribbean Trade Council',
        purpose: 'Mediate fishing rights dispute between communities',
        allocation: {
            communityRebuilding: 15,
            ecologicalPeace: 25,
            conflictResolution: 50,
            sovereigntySupport: 10
        },
        value: 30000,
        currency: 'CR',
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months
        redemptionMechanism: 'milestone-based',
        milestones: [
            { name: 'Initial mediation session held', completed: true },
            { name: 'Resource assessment completed', completed: true },
            { name: 'Fair allocation framework agreed', completed: true },
            { name: 'Pilot program implemented', completed: false },
            { name: 'Long-term agreement signed', completed: false }
        ]
    });
    console.log(`✅ Created: ${bond3.id} - ${bond3.purpose}`);

    // Update some milestones to simulate progress
    console.log('\n🔄 Updating milestones...');
    peacebondContract.updateMilestone(bond2.id, 0, true);
    peacebondContract.updateMilestone(bond2.id, 1, true);
    peacebondContract.updateMilestone(bond3.id, 0, true);
    peacebondContract.updateMilestone(bond3.id, 1, true);
    peacebondContract.updateMilestone(bond3.id, 2, true);

    // Demonstrate AI conflict resolution
    console.log('\n🤖 AI Conflict Analysis Example');
    const disputeAnalysis = aiResolution.analyzeDispute({
        parties: ['Community A Fishers', 'Community B Fishers'],
        type: 'resource',
        severity: 'medium',
        duration: 90,
        context: {
            resource: 'fishing_grounds',
            historical: true
        },
        resources: {
            mediator: true,
            funding: true,
            community_support: true
        }
    });
    console.log(`📊 Dispute Analysis: ${disputeAnalysis.disputeId}`);
    console.log(`   Risk Level: ${disputeAnalysis.analysis.riskLevel}`);
    console.log(`   Top Strategy: ${disputeAnalysis.suggestedOutcomes[0].name}`);
    console.log(`   Success Probability: ${(disputeAnalysis.suggestedOutcomes[0].successProbability * 100).toFixed(1)}%`);

    // Monitor peace metrics
    console.log('\n📈 Monitoring Peace Metrics');
    const peaceMetrics = aiResolution.monitorPeaceMetrics(disputeAnalysis.disputeId, {
        cooperationIndicators: {
            communication: 0.8,
            negotiation: 0.7,
            compromise: 0.6
        },
        violentIncidents: 0,
        timeframeDays: 30,
        agreementsKept: 5,
        totalAgreements: 6,
        milestones: [
            { completed: true },
            { completed: true },
            { completed: true },
            { completed: false }
        ],
        safetySurvey: 0.85,
        economicIndicators: 0.7,
        socialCohesion: 0.75,
        institutionalSupport: 0.8,
        communityOwnership: 0.9,
        resourceAvailability: 0.75,
        politicalStability: 0.8,
        nonViolentScore: 0.95,
        lifeEnhancementScore: 0.85
    });
    console.log(`   Status: ${peaceMetrics.status}`);
    console.log(`   Cooperation Level: ${(peaceMetrics.cooperationLevel * 100).toFixed(1)}%`);
    console.log(`   Trust Score: ${(peaceMetrics.trustScore * 100).toFixed(1)}%`);
    console.log(`   Progress: ${(peaceMetrics.progressTowardPeace * 100).toFixed(1)}%`);

    // Get system statistics
    console.log('\n📊 System Statistics');
    const stats = peacebondContract.getStatistics();
    console.log(`   Total Peacebonds: ${stats.totalPeacebonds}`);
    console.log(`   Active Peacebonds: ${stats.activePeacebonds}`);
    console.log(`   Total Value: ${stats.totalValue} CR`);
    console.log(`   Average Resonance Score: ${stats.averageResonanceScore.toFixed(2)}`);
    console.log(`   Average AI Compliance: ${stats.averageAIComplianceScore.toFixed(2)}%`);

    // Track a specific peacebond
    console.log('\n🔍 Tracking Peacebond Progress');
    const tracking = peacebondContract.trackPeacebond(bond3.id);
    console.log(`   Bond ID: ${tracking.id}`);
    console.log(`   Purpose: ${tracking.purpose}`);
    console.log(`   Progress: ${tracking.tracking.progress}%`);
    console.log(`   Milestones: ${tracking.tracking.milestonesCompleted}/${tracking.tracking.totalMilestones}`);
    console.log(`   Current Value: ${tracking.tracking.currentValue} CR`);
    console.log(`   Days Active: ${tracking.tracking.daysActive}`);
    console.log(`   Days Until Expiry: ${tracking.tracking.daysUntilExpiry}`);

    console.log('\n✨ Peacebond System Initialized Successfully!');
    console.log('🔗 Blockchain nodes synchronized');
    console.log('🤖 AI Resolution system active');
    console.log('🌍 Peace metrics monitoring enabled');

    // Return system instance for use in web interface
    return {
        peacebondContract,
        aiResolution,
        exampleBonds: [bond1, bond2, bond3],
        exampleDispute: disputeAnalysis
    };
};

// Auto-initialize if in browser context
if (typeof window !== 'undefined') {
    // Store global instance
    window.peacebondSystem = null;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (typeof PeacebondContract !== 'undefined' && typeof AIConflictResolution !== 'undefined') {
                window.peacebondSystem = initializePeacebondSystem();
            }
        });
    } else {
        if (typeof PeacebondContract !== 'undefined' && typeof AIConflictResolution !== 'undefined') {
            window.peacebondSystem = initializePeacebondSystem();
        }
    }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = initializePeacebondSystem;
}
