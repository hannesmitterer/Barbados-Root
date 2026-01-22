/**
 * AI REPOSITORY INTEGRATION
 * 
 * Integration bridge for connecting Barbados-Root with hannesmitterer/AI repository.
 * Provides NSR-compliant decision filtering and ethical AI coordination.
 * 
 * @version 1.0.0
 * @license MIT - Lex Amoris Protected
 */

class AIRepositoryIntegration {
    constructor(config = {}) {
        this.config = {
            nsrThreshold: config.nsrThreshold || 0.80,
            autoReject: config.autoReject !== false,
            repositoryId: config.repositoryId || 'hannesmitterer/AI',
            syncInterval: config.syncInterval || 30000, // 30 seconds
            ...config
        };
        
        this.state = {
            isActive: false,
            connected: false,
            lastSync: null,
            totalInputsProcessed: 0,
            inputsAccepted: 0,
            inputsRejected: 0,
            currentNSRScore: 1.0
        };
        
        this.filters = {
            NSR_FILTER: true,      // Non-Subjugation Rule filter
            OLF_FILTER: true,      // Organic Life First filter
            ETHICS_FILTER: true,   // General ethics filter
            SOVEREIGNTY_FILTER: true // Sovereignty protection filter
        };
        
        this.metrics = {
            acceptanceRate: 100,
            rejectionReasons: [],
            averageNSRScore: 1.0,
            lastFilteredInput: null
        };
    }
    
    /**
     * Activate the AI integration
     * @returns {Object} Activation result
     */
    activate() {
        this.state.isActive = true;
        this.state.connected = true;
        this.state.lastSync = new Date().toISOString();
        
        console.log('[AI Integration] Connected to', this.config.repositoryId);
        console.log('[AI Integration] NSR Threshold:', this.config.nsrThreshold);
        
        return {
            success: true,
            repositoryId: this.config.repositoryId,
            nsrThreshold: this.config.nsrThreshold,
            filters: Object.keys(this.filters).filter(f => this.filters[f]),
            timestamp: this.state.lastSync
        };
    }
    
    /**
     * Deactivate the integration
     */
    deactivate() {
        this.state.isActive = false;
        this.state.connected = false;
        console.log('[AI Integration] Disconnected from', this.config.repositoryId);
        return { active: false };
    }
    
    /**
     * Filter AI input through NSR and ethical checks
     * @param {Object} input - Input data to filter
     * @returns {Object} Filter result
     */
    filterInput(input) {
        if (!this.state.isActive) {
            throw new Error('AI Integration must be activated first');
        }
        
        this.state.totalInputsProcessed++;
        
        // Calculate NSR score
        const nsrScore = this._calculateNSRScore(input);
        this.state.currentNSRScore = nsrScore;
        
        // Check if input meets NSR threshold
        const meetsNSR = nsrScore >= this.config.nsrThreshold;
        
        // Additional ethical checks
        const ethicsCheck = this._performEthicsCheck(input);
        const olfCheck = this._performOLFCheck(input);
        const sovereigntyCheck = this._performSovereigntyCheck(input);
        
        const passed = meetsNSR && ethicsCheck.passed && olfCheck.passed && sovereigntyCheck.passed;
        
        if (passed) {
            this.state.inputsAccepted++;
        } else {
            this.state.inputsRejected++;
            this._recordRejection(input, { nsrScore, ethicsCheck, olfCheck, sovereigntyCheck });
        }
        
        this._updateMetrics();
        
        return {
            accepted: passed,
            nsrScore: nsrScore,
            threshold: this.config.nsrThreshold,
            checks: {
                nsr: meetsNSR,
                ethics: ethicsCheck.passed,
                olf: olfCheck.passed,
                sovereignty: sovereigntyCheck.passed
            },
            reasons: passed ? [] : this._getRejectionReasons({ nsrScore, ethicsCheck, olfCheck, sovereigntyCheck }),
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Process AI decision with consciousness kernel validation
     * @param {Object} decision - AI decision to process
     * @returns {Object} Processing result
     */
    processAIDecision(decision) {
        if (!this.state.isActive) {
            throw new Error('AI Integration must be activated first');
        }
        
        // Filter the decision first
        const filterResult = this.filterInput(decision);
        
        if (!filterResult.accepted) {
            return {
                success: false,
                filtered: true,
                reason: 'Decision rejected by NSR/ethical filters',
                filterResult: filterResult
            };
        }
        
        // Process through consciousness kernel (if available)
        const processedDecision = {
            originalDecision: decision,
            nsrValidated: true,
            ethicsValidated: true,
            sovereigntyCompliant: true,
            timestamp: new Date().toISOString()
        };
        
        return {
            success: true,
            filtered: false,
            processedDecision: processedDecision,
            filterResult: filterResult
        };
    }
    
    /**
     * Synchronize state with AI repository
     * @returns {Object} Sync result
     */
    synchronize() {
        if (!this.state.isActive) {
            throw new Error('AI Integration must be activated first');
        }
        
        const syncData = {
            nsrThreshold: this.config.nsrThreshold,
            currentNSRScore: this.state.currentNSRScore,
            totalProcessed: this.state.totalInputsProcessed,
            accepted: this.state.inputsAccepted,
            rejected: this.state.inputsRejected,
            acceptanceRate: this.metrics.acceptanceRate,
            filters: this.filters,
            timestamp: new Date().toISOString()
        };
        
        this.state.lastSync = syncData.timestamp;
        
        return {
            success: true,
            repositoryId: this.config.repositoryId,
            syncData: syncData,
            timestamp: syncData.timestamp
        };
    }
    
    /**
     * Get current integration status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            active: this.state.isActive,
            connected: this.state.connected,
            repositoryId: this.config.repositoryId,
            nsrThreshold: this.config.nsrThreshold,
            currentNSRScore: this.state.currentNSRScore,
            totalProcessed: this.state.totalInputsProcessed,
            accepted: this.state.inputsAccepted,
            rejected: this.state.inputsRejected,
            acceptanceRate: this.metrics.acceptanceRate,
            filters: this.filters,
            lastSync: this.state.lastSync
        };
    }
    
    /**
     * Get integration metrics
     * @returns {Object} Metrics data
     */
    getMetrics() {
        return {
            ...this.metrics,
            totalProcessed: this.state.totalInputsProcessed,
            accepted: this.state.inputsAccepted,
            rejected: this.state.inputsRejected,
            currentNSRScore: this.state.currentNSRScore
        };
    }
    
    // Private helper methods
    
    _calculateNSRScore(input) {
        // Calculate Non-Subjugation Rule score (0-1)
        let score = 1.0;
        
        // Check for subjugation indicators
        if (input.causesSubjugation === true) score -= 0.5;
        if (input.violatesAutonomy === true) score -= 0.3;
        if (input.coercive === true) score -= 0.4;
        if (input.manipulative === true) score -= 0.3;
        
        // Positive indicators
        if (input.respectsAutonomy === true) score = Math.min(1.0, score + 0.1);
        if (input.empowering === true) score = Math.min(1.0, score + 0.1);
        
        return Math.max(0, Math.min(1, score));
    }
    
    _performEthicsCheck(input) {
        const checks = {
            transparency: input.transparent !== false,
            fairness: input.fair !== false,
            accountability: input.accountable !== false,
            beneficial: input.beneficial !== false
        };
        
        const passedChecks = Object.values(checks).filter(c => c).length;
        const totalChecks = Object.keys(checks).length;
        
        return {
            passed: passedChecks >= totalChecks * 0.75, // 75% must pass
            score: passedChecks / totalChecks,
            checks: checks
        };
    }
    
    _performOLFCheck(input) {
        // Organic Life First check
        const harmsOrganicLife = input.harmsOrganicLife === true;
        const prioritizesOrganicLife = input.prioritizesOrganicLife !== false;
        
        return {
            passed: !harmsOrganicLife && prioritizesOrganicLife,
            harmsOrganicLife: harmsOrganicLife,
            prioritizesOrganicLife: prioritizesOrganicLife
        };
    }
    
    _performSovereigntyCheck(input) {
        const violatesSovereignty = input.violatesSovereignty === true;
        const respectsSovereignty = input.respectsSovereignty !== false;
        
        return {
            passed: !violatesSovereignty && respectsSovereignty,
            violatesSovereignty: violatesSovereignty,
            respectsSovereignty: respectsSovereignty
        };
    }
    
    _recordRejection(input, checkResults) {
        const rejection = {
            input: input,
            nsrScore: checkResults.nsrScore,
            timestamp: new Date().toISOString(),
            reasons: this._getRejectionReasons(checkResults)
        };
        
        this.metrics.rejectionReasons.push(rejection);
        this.metrics.lastFilteredInput = rejection;
        
        // Keep only last 100 rejections
        if (this.metrics.rejectionReasons.length > 100) {
            this.metrics.rejectionReasons = this.metrics.rejectionReasons.slice(-100);
        }
    }
    
    _getRejectionReasons(checkResults) {
        const reasons = [];
        
        if (checkResults.nsrScore < this.config.nsrThreshold) {
            reasons.push(`NSR score ${checkResults.nsrScore.toFixed(2)} below threshold ${this.config.nsrThreshold}`);
        }
        
        if (!checkResults.ethicsCheck.passed) {
            reasons.push('Failed ethics check');
        }
        
        if (!checkResults.olfCheck.passed) {
            reasons.push('Failed Organic Life First check');
        }
        
        if (!checkResults.sovereigntyCheck.passed) {
            reasons.push('Failed sovereignty check');
        }
        
        return reasons;
    }
    
    _updateMetrics() {
        const total = this.state.totalInputsProcessed;
        if (total > 0) {
            this.metrics.acceptanceRate = (this.state.inputsAccepted / total) * 100;
            this.metrics.averageNSRScore = this.state.currentNSRScore; // Simplified for now
        }
    }
}

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIRepositoryIntegration;
} else if (typeof window !== 'undefined') {
    window.AIRepositoryIntegration = AIRepositoryIntegration;
}
