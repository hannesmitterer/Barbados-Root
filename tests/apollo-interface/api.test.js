/**
 * Tests for Apollo Interface - API Endpoints
 */

const { ApolloAPI } = require('../../src/apollo-interface/api');
const { ApolloInterface } = require('../../src/apollo-interface/interface');
const { ShythiaBlockchain } = require('../../src/shythia-block/block');
const { PredictionEngine } = require('../../src/euystacio-ai/prediction');

describe('ApolloAPI', () => {
    let api;
    let apollo;
    let blockchain;
    let aiEngine;

    beforeEach(() => {
        apollo = new ApolloInterface();
        blockchain = new ShythiaBlockchain();
        aiEngine = new PredictionEngine();
        aiEngine.registerModel('default', { type: 'resonance' });
        apollo.initialize(blockchain, aiEngine);
        api = new ApolloAPI(apollo);
    });

    test('should initialize API with routes', () => {
        const routes = api.getRoutes();
        expect(routes.length).toBeGreaterThan(0);
    });

    test('should handle GET /health request', () => {
        const response = api.handleRequest('GET', '/health');
        
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('healthy');
    });

    test('should handle GET /status request', () => {
        const response = api.handleRequest('GET', '/status');
        
        expect(response.status).toBe(200);
        expect(response.data.apollo).toBeDefined();
    });

    test('should handle GET /blockchain/validate request', () => {
        const response = api.handleRequest('GET', '/blockchain/validate');
        
        expect(response.status).toBe(200);
        expect(response.data.valid).toBe(true);
    });

    test('should handle POST /ai/predict request', () => {
        const response = api.handleRequest('POST', '/ai/predict', { value: 100 });
        
        expect(response.status).toBe(200);
        expect(response.data.predicted_value).toBeDefined();
    });

    test('should handle GET /ai/models request', () => {
        const response = api.handleRequest('GET', '/ai/models');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
    });

    test('should handle POST /workflow/process request', () => {
        const response = api.handleRequest('POST', '/workflow/process', { value: 100 });
        
        expect(response.status).toBe(200);
        expect(response.data.stages).toBeDefined();
    });

    test('should return 404 for non-existent route', () => {
        const response = api.handleRequest('GET', '/non-existent');
        
        expect(response.status).toBe(404);
        expect(response.error).toBe('Route not found');
    });

    test('should return 500 for request errors', () => {
        const response = api.handleRequest('POST', '/ai/predict', null);
        
        expect(response.status).toBe(500);
        expect(response.error).toBeDefined();
    });

    test('should allow custom route registration', () => {
        api.addRoute('GET', '/custom', () => ({ custom: 'data' }));
        const response = api.handleRequest('GET', '/custom');
        
        expect(response.status).toBe(200);
        expect(response.data.custom).toBe('data');
    });
});
