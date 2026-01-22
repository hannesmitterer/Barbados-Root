/**
 * Tests for Apollo Interface - Integration Layer
 */

const { ApolloInterface } = require('../../src/apollo-interface/interface');
const { ShythiaBlockchain } = require('../../src/shythia-block/block');
const { PredictionEngine } = require('../../src/euystacio-ai/prediction');

describe('ApolloInterface', () => {
    let apollo;
    let blockchain;
    let aiEngine;

    beforeEach(() => {
        apollo = new ApolloInterface();
        blockchain = new ShythiaBlockchain();
        aiEngine = new PredictionEngine();
        aiEngine.registerModel('default', { type: 'resonance' });
    });

    test('should initialize interface', () => {
        expect(apollo.initialized).toBe(false);
        apollo.initialize(blockchain, aiEngine);
        expect(apollo.initialized).toBe(true);
    });

    test('should get health status', () => {
        apollo.initialize(blockchain, aiEngine);
        const health = apollo.getHealthStatus();
        
        expect(health.status).toBe('healthy');
        expect(health.initialized).toBe(true);
        expect(health.blockchain).toBe(true);
        expect(health.ai).toBe(true);
    });

    test('should validate blockchain', () => {
        apollo.initialize(blockchain, aiEngine);
        const result = apollo.validateBlockchain();
        
        expect(result.valid).toBe(true);
        expect(result.blocks).toBeGreaterThan(0);
        expect(result.latestBlock).toBeDefined();
    });

    test('should run AI predictions', () => {
        apollo.initialize(blockchain, aiEngine);
        const result = apollo.runPrediction({ value: 100 });
        
        expect(result.predicted_value).toBeDefined();
        expect(result.confidence).toBeDefined();
        expect(result.nsr_compliance).toBeDefined();
        expect(typeof result.nsr_compliance).toBe('boolean');
    });

    test('should throw error when blockchain not initialized', () => {
        expect(() => {
            apollo.validateBlockchain();
        }).toThrow('Blockchain connector not initialized');
    });

    test('should throw error when AI not initialized', () => {
        expect(() => {
            apollo.runPrediction({ value: 100 });
        }).toThrow('AI connector not initialized');
    });

    test('should get system status', () => {
        apollo.initialize(blockchain, aiEngine);
        const status = apollo.getSystemStatus();
        
        expect(status.apollo).toBeDefined();
        expect(status.apollo.version).toBe('1.0.0');
        expect(status.shythiaBlock).toBeDefined();
        expect(status.euystacioAI).toBeDefined();
    });

    test('should call registered endpoints', async () => {
        apollo.initialize(blockchain, aiEngine);
        const result = await apollo.callEndpoint('health');
        
        expect(result.status).toBe('healthy');
    });

    test('should throw error for non-existent endpoint', async () => {
        apollo.initialize(blockchain, aiEngine);
        
        await expect(apollo.callEndpoint('non-existent'))
            .rejects.toThrow('Endpoint non-existent not found');
    });

    test('should process integrated workflow', () => {
        apollo.initialize(blockchain, aiEngine);
        const result = apollo.processIntegratedWorkflow({ value: 100 });
        
        expect(result.input).toEqual({ value: 100 });
        expect(result.stages.length).toBeGreaterThan(0);
        expect(result.success).toBeDefined();
    });

    test('should handle workflow with missing connectors', () => {
        const result = apollo.processIntegratedWorkflow({ value: 100 });
        
        expect(result.stages.length).toBe(0);
    });
});
