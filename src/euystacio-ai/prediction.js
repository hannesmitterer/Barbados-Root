/**
 * Euystacio-AI - Prediction Logic Framework
 * AI prediction and decision-making logic
 */

class PredictionEngine {
    constructor() {
        this.models = new Map();
        this.history = [];
    }

    registerModel(name, config) {
        this.models.set(name, {
            name: name,
            config: config,
            accuracy: 0,
            predictions: 0
        });
    }

    predict(modelName, inputData) {
        if (!this.models.has(modelName)) {
            throw new Error(`Model ${modelName} not found`);
        }

        const model = this.models.get(modelName);
        
        // Simulate AI prediction
        const prediction = this.runPrediction(inputData, model);
        
        // Update model stats
        model.predictions++;
        this.history.push({
            model: modelName,
            input: inputData,
            prediction: prediction,
            timestamp: Date.now()
        });

        return prediction;
    }

    runPrediction(data, model) {
        // Simulate prediction based on input data
        const baseValue = typeof data === 'object' && data.value 
            ? data.value 
            : Math.random() * 100;

        // Derive confidence for this prediction
        const confidence = 0.85 + Math.random() * 0.15;

        // Compute compliance and OLF score based on input data and model configuration
        const config = model && typeof model.config === 'object' ? model.config : {};
        const complianceThreshold = typeof config.complianceThreshold === 'number'
            ? config.complianceThreshold
            : 50;

        // For this simple simulation, treat values below the threshold as compliant
        const nsr_compliance = baseValue <= complianceThreshold;

        // Normalize baseValue to [0, 1] assuming a nominal 0–100 range,
        // and blend with confidence to derive a stable OLF score
        const normalizedBase = Math.max(0, Math.min(1, baseValue / 100));
        const olf_score = Math.max(0, Math.min(1, (normalizedBase * 0.6) + (confidence * 0.4)));

        return {
            predicted_value: baseValue * 1.1,
            confidence: confidence,
            model: model.name,
            nsr_compliance: nsr_compliance,
            olf_score: Number(olf_score.toFixed(3)),
            timestamp: Date.now()
        };
    }

    evaluate(modelName, testData, actualResults) {
        if (!this.models.has(modelName)) {
            throw new Error(`Model ${modelName} not found`);
        }

        let correct = 0;
        const predictions = testData.map((data, index) => {
            const prediction = this.predict(modelName, data);
            const actual = actualResults[index];
            
            // Simple accuracy check (within 10% tolerance)
            // Handle division by zero when actual is zero
            let isCorrect;
            if (actual === 0) {
                isCorrect = Math.abs(prediction.predicted_value) < 0.1;
            } else {
                isCorrect = Math.abs(prediction.predicted_value - actual) / Math.abs(actual) < 0.1;
            }
            if (isCorrect) correct++;

            return { prediction, actual, correct: isCorrect };
        });

        const accuracy = correct / testData.length;
        const model = this.models.get(modelName);
        model.accuracy = accuracy;

        return {
            model: modelName,
            accuracy: accuracy,
            predictions: predictions
        };
    }

    getModelStats(modelName) {
        if (!this.models.has(modelName)) {
            return null;
        }

        const model = this.models.get(modelName);
        return {
            name: model.name,
            accuracy: model.accuracy,
            totalPredictions: model.predictions,
            config: model.config
        };
    }

    getAllModels() {
        return Array.from(this.models.values());
    }
}

module.exports = { PredictionEngine };
