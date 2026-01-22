/**
 * Apollo Interface - Integration Layer
 * Connects Shythia Block, Euystacio-AI, and external systems
 */

class ApolloInterface {
    constructor() {
        this.blockchainConnector = null;
        this.aiConnector = null;
        this.endpoints = new Map();
        this.initialized = false;
    }

    initialize(blockchainInstance, aiInstance) {
        this.blockchainConnector = blockchainInstance;
        this.aiConnector = aiInstance;
        this.initialized = true;
        
        this.registerDefaultEndpoints();
    }

    registerDefaultEndpoints() {
        this.registerEndpoint('health', () => this.getHealthStatus());
        this.registerEndpoint('blockchain/validate', (data) => this.validateBlockchain(data));
        this.registerEndpoint('ai/predict', (data) => this.runPrediction(data));
        this.registerEndpoint('system/status', () => this.getSystemStatus());
    }

    registerEndpoint(path, handler) {
        this.endpoints.set(path, handler);
    }

    async callEndpoint(path, data = null) {
        if (!this.endpoints.has(path)) {
            throw new Error(`Endpoint ${path} not found`);
        }

        const handler = this.endpoints.get(path);
        return await handler(data);
    }

    getHealthStatus() {
        return {
            status: 'healthy',
            initialized: this.initialized,
            blockchain: this.blockchainConnector !== null,
            ai: this.aiConnector !== null,
            timestamp: Date.now()
        };
    }

    validateBlockchain(data) {
        if (!this.blockchainConnector) {
            throw new Error('Blockchain connector not initialized');
        }

        const isValid = this.blockchainConnector.isChainValid();
        const chain = this.blockchainConnector.getChain();

        return {
            valid: isValid,
            blocks: chain.length,
            latestBlock: chain[chain.length - 1],
            timestamp: Date.now()
        };
    }

    runPrediction(data) {
        if (!this.aiConnector) {
            throw new Error('AI connector not initialized');
        }

        // Use first available model or create default
        const models = this.aiConnector.getAllModels();
        const modelName = models.length > 0 ? models[0].name : 'default';

        if (models.length === 0) {
            this.aiConnector.registerModel('default', { type: 'resonance' });
        }

        return this.aiConnector.predict(modelName, data);
    }

    getSystemStatus() {
        const status = {
            apollo: {
                version: '1.0.0',
                initialized: this.initialized,
                endpoints: Array.from(this.endpoints.keys())
            }
        };

        if (this.blockchainConnector) {
            const chain = this.blockchainConnector.getChain();
            status.shythiaBlock = {
                connected: true,
                blocks: chain.length,
                valid: this.blockchainConnector.isChainValid()
            };
        }

        if (this.aiConnector) {
            const models = this.aiConnector.getAllModels();
            status.euystacioAI = {
                connected: true,
                models: models.length,
                modelNames: models.map(m => m.name)
            };
        }

        return status;
    }

    processIntegratedWorkflow(inputData) {
        const results = {
            input: inputData,
            stages: []
        };

        // Stage 1: AI Processing
        if (this.aiConnector) {
            try {
                const aiResult = this.runPrediction(inputData);
                results.stages.push({
                    stage: 'ai_prediction',
                    success: true,
                    result: aiResult
                });
            } catch (error) {
                results.stages.push({
                    stage: 'ai_prediction',
                    success: false,
                    error: error.message
                });
            }
        }

        // Stage 2: Blockchain Validation
        if (this.blockchainConnector) {
            try {
                const blockchainResult = this.validateBlockchain();
                results.stages.push({
                    stage: 'blockchain_validation',
                    success: true,
                    result: blockchainResult
                });
            } catch (error) {
                results.stages.push({
                    stage: 'blockchain_validation',
                    success: false,
                    error: error.message
                });
            }
        }

        results.timestamp = Date.now();
        results.success = results.stages.every(stage => stage.success);

        return results;
    }
}

module.exports = { ApolloInterface };
