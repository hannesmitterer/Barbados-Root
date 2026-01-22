/**
 * Tests for Euystacio-AI - Prediction Engine
 */

const { PredictionEngine } = require('../../src/euystacio-ai/prediction');

describe('PredictionEngine', () => {
    let engine;

    beforeEach(() => {
        engine = new PredictionEngine();
    });

    test('should initialize with empty models', () => {
        expect(engine.getAllModels().length).toBe(0);
    });

    test('should register a model', () => {
        engine.registerModel('test-model', { type: 'resonance' });
        const models = engine.getAllModels();
        
        expect(models.length).toBe(1);
        expect(models[0].name).toBe('test-model');
    });

    test('should make predictions', () => {
        engine.registerModel('test-model', { type: 'resonance' });
        const prediction = engine.predict('test-model', { value: 100 });
        
        expect(prediction).toBeDefined();
        expect(prediction.predicted_value).toBeDefined();
        expect(prediction.confidence).toBeGreaterThan(0);
        expect(prediction.nsr_compliance).toBe(true);
    });

    test('should throw error for non-existent model', () => {
        expect(() => {
            engine.predict('non-existent', { value: 100 });
        }).toThrow('Model non-existent not found');
    });

    test('should track prediction history', () => {
        engine.registerModel('test-model', { type: 'resonance' });
        engine.predict('test-model', { value: 100 });
        engine.predict('test-model', { value: 200 });
        
        expect(engine.history.length).toBe(2);
    });

    test('should evaluate model accuracy', () => {
        engine.registerModel('test-model', { type: 'resonance' });
        
        const testData = [
            { value: 100 },
            { value: 200 },
            { value: 300 }
        ];
        const actualResults = [110, 220, 330];
        
        const evaluation = engine.evaluate('test-model', testData, actualResults);
        
        expect(evaluation.model).toBe('test-model');
        expect(evaluation.accuracy).toBeDefined();
        expect(evaluation.predictions.length).toBe(3);
    });

    test('should get model statistics', () => {
        engine.registerModel('test-model', { type: 'resonance' });
        engine.predict('test-model', { value: 100 });
        
        const stats = engine.getModelStats('test-model');
        
        expect(stats.name).toBe('test-model');
        expect(stats.totalPredictions).toBe(1);
        expect(stats.config).toEqual({ type: 'resonance' });
    });

    test('should return null for non-existent model stats', () => {
        const stats = engine.getModelStats('non-existent');
        expect(stats).toBeNull();
    });

    test('should update model prediction count', () => {
        engine.registerModel('test-model', { type: 'resonance' });
        
        engine.predict('test-model', { value: 100 });
        engine.predict('test-model', { value: 200 });
        
        const stats = engine.getModelStats('test-model');
        expect(stats.totalPredictions).toBe(2);
    });
});
