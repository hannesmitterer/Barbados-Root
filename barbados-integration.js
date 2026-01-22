/**
 * BARBADOS ROOT INTEGRATION
 * 
 * Integration module that brings together Shythia Block, Euystacio-AI,
 * and Apollo Interface into a cohesive system.
 * 
 * @module BarbadosRootIntegration
 */

// Load modules if in Node.js environment
let ShythiaBlock, EuystacioAI, ApolloInterface;
if (typeof require !== 'undefined') {
    ShythiaBlock = require('./shythia-block.js');
    EuystacioAI = require('./euystacio-ai.js');
    ApolloInterface = require('./apollo-interface.js');
}

// Main integration class
class BarbadosRootIntegration {
    constructor(config = {}) {
        this.config = {
            sovereignNode: config.sovereignNode || 'BARBADOS-ROOT',
            ...config
        };
        
        // Initialize all modules
        this.shythiaBlock = new ShythiaBlock({
            sovereignNode: this.config.sovereignNode,
            ...config.shythia
        });
        
        this.euystacioAI = new EuystacioAI({
            sovereignNode: this.config.sovereignNode,
            ...config.euystacio
        });
        
        this.apolloInterface = new ApolloInterface({
            sovereignNode: this.config.sovereignNode,
            shythiaBlock: this.shythiaBlock,
            euystacioAI: this.euystacioAI,
            ...config.apollo
        });
        
        this.init();
    }
    
    init() {
        console.log(`[BarbadosRoot] System initialized on node: ${this.config.sovereignNode}`);
        console.log('[BarbadosRoot] All modules operational:');
        console.log('  - Shythia Block: ACTIVE');
        console.log('  - Euystacio-AI: ACTIVE');
        console.log('  - Apollo Interface: ACTIVE');
        
        // Inject module references
        this.apolloInterface.injectModules({
            shythiaBlock: this.shythiaBlock,
            euystacioAI: this.euystacioAI
        });
    }
    
    /**
     * Process a complete transaction through the integrated system
     * @param {Object} transactionData - Transaction data
     * @returns {Object} Complete processing result
     */
    processTransaction(transactionData) {
        // Step 1: AI decision validation
        const aiDecision = this.euystacioAI.processDecision({
            ...transactionData,
            stakes: transactionData.amount > 1000000 ? 'high' : 'normal',
            consultNodes: 4
        });
        
        if (!aiDecision.approved) {
            return {
                success: false,
                stage: 'AI_VALIDATION',
                reason: aiDecision.reason,
                aiDecision
            };
        }
        
        // Step 2: Add to blockchain
        const txId = this.shythiaBlock.addTransaction({
            ...transactionData,
            aiDecisionId: aiDecision.id,
            aiApproval: aiDecision.result
        });
        
        // Step 3: Get updated visualization
        const dashboard = this.apolloInterface.getDashboard();
        
        return {
            success: true,
            transactionId: txId,
            aiDecisionId: aiDecision.id,
            dashboard
        };
    }
    
    /**
     * Get comprehensive system status
     * @returns {Object} Complete system status
     */
    getSystemStatus() {
        return {
            timestamp: Date.now(),
            node: this.config.sovereignNode,
            modules: {
                shythia: this.shythiaBlock.getMetrics(),
                euystacio: this.euystacioAI.getState(),
                apollo: this.apolloInterface.getState()
            },
            dashboard: this.apolloInterface.getDashboard(),
            systemHealth: this.calculateSystemHealth()
        };
    }
    
    /**
     * Calculate overall system health
     * @returns {Object} System health metrics
     */
    calculateSystemHealth() {
        const shythiaMetrics = this.shythiaBlock.getMetrics();
        const euystacioState = this.euystacioAI.getState();
        const apolloState = this.apolloInterface.getState();
        
        const healthScore = (
            shythiaMetrics.integrityScore / 100 * 0.4 +
            euystacioState.autonomyScore * 0.3 +
            apolloState.alignmentMetrics.systemIntegrity * 0.3
        );
        
        return {
            score: healthScore,
            status: healthScore > 0.9 ? 'OPTIMAL' : 
                   healthScore > 0.75 ? 'STABLE' : 
                   healthScore > 0.5 ? 'DEGRADED' : 'CRITICAL',
            components: {
                blockchain: shythiaMetrics.integrityScore / 100,
                ai: euystacioState.autonomyScore,
                interface: apolloState.alignmentMetrics.systemIntegrity
            }
        };
    }
    
    /**
     * Get module references for external use
     * @returns {Object} Module references
     */
    getModules() {
        return {
            shythiaBlock: this.shythiaBlock,
            euystacioAI: this.euystacioAI,
            apolloInterface: this.apolloInterface
        };
    }
}

// Make classes available globally if in browser
if (typeof window !== 'undefined') {
    window.BarbadosRootIntegration = BarbadosRootIntegration;
    window.ShythiaBlock = ShythiaBlock;
    window.EuystacioAI = EuystacioAI;
    window.ApolloInterface = ApolloInterface;
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BarbadosRootIntegration,
        ShythiaBlock,
        EuystacioAI,
        ApolloInterface
    };
}
