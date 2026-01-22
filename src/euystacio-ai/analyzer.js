/**
 * Euystacio-AI - Analyzer Cluster Module
 * Computing and analyzing cluster with input-output node simulation
 */

class AnalyzerNode {
    constructor(id, type = 'compute') {
        this.id = id;
        this.type = type; // 'input', 'compute', 'output'
        this.status = 'idle';
        this.data = null;
        this.connections = [];
    }

    connect(node) {
        this.connections.push(node);
    }

    processInput(data) {
        this.status = 'processing';
        this.data = data;
        
        // Simulate processing
        const processed = this.analyze(data);
        
        this.status = 'idle';
        return processed;
    }

    analyze(data) {
        switch (this.type) {
            case 'input':
                return { ...data, processed: true, timestamp: Date.now() };
            case 'compute':
                return { 
                    ...data, 
                    computed: true,
                    result: this.computeMetrics(data)
                };
            case 'output':
                return { 
                    ...data, 
                    finalized: true,
                    output: this.formatOutput(data)
                };
            default:
                return data;
        }
    }

    computeMetrics(data) {
        if (!data || typeof data !== 'object') {
            return { error: 'Invalid input data' };
        }

        // Derive simple metrics from input data to avoid static, misleading values
        const numericValues = Object.values(data).filter(
            (v) => typeof v === 'number' && Number.isFinite(v)
        );

        let nsr_drift;
        let olf_score;
        let resonance_freq;

        if (numericValues.length > 0) {
            const count = numericValues.length;
            const sum = numericValues.reduce((acc, v) => acc + v, 0);
            const mean = sum / count;

            const variance =
                numericValues.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) /
                count;
            const stdDev = Math.sqrt(variance);

            // Normalize metrics into reasonable ranges and round to 3 decimals
            nsr_drift = Number(Math.tanh(Math.abs(mean)).toFixed(3));
            olf_score = Number((1 / (1 + Math.exp(-stdDev))).toFixed(3));
            resonance_freq = Number(
                (Math.tanh(variance / (1 + Math.abs(mean))) * 0.5 + 0.5).toFixed(3)
            );
        } else {
            // Fallback: base metrics on serialized length for non-numeric data
            const serialized = JSON.stringify(data);
            const len = serialized.length || 1;

            nsr_drift = Number(((len % 100) / 100).toFixed(3));
            olf_score = Number((((len * 7) % 100) / 100).toFixed(3));
            resonance_freq = Number((((len * 13) % 100) / 100).toFixed(3));
        }

        return {
            nsr_drift,
            olf_score,
            resonance_freq,
            timestamp: Date.now()
        };
    }

    formatOutput(data) {
        return {
            nodeId: this.id,
            status: 'success',
            data: data,
            timestamp: Date.now()
        };
    }

    getStatus() {
        return {
            id: this.id,
            type: this.type,
            status: this.status,
            connections: this.connections.length
        };
    }
}

class AnalyzerCluster {
    constructor(name = 'Euystacio-Primary') {
        this.name = name;
        this.nodes = [];
        this.inputNodes = [];
        this.computeNodes = [];
        this.outputNodes = [];
    }

    addNode(node) {
        this.nodes.push(node);
        
        switch (node.type) {
            case 'input':
                this.inputNodes.push(node);
                break;
            case 'compute':
                this.computeNodes.push(node);
                break;
            case 'output':
                this.outputNodes.push(node);
                break;
        }
    }

    createNode(id, type) {
        const node = new AnalyzerNode(id, type);
        this.addNode(node);
        return node;
    }

    process(inputData) {
        const results = [];

        // Pipeline: input -> compute chain -> output
        for (const inputNode of this.inputNodes) {
            // Input phase
            let currentData = inputNode.processInput(inputData);

            // Compute phase: pass data through each compute node sequentially
            for (const computeNode of this.computeNodes) {
                currentData = computeNode.processInput(currentData);
            }

            // Output phase: each output node consumes the fully computed data
            for (const outputNode of this.outputNodes) {
                const output = outputNode.processInput(currentData);
                results.push(output);
            }
        }

        return results;
    }

    getClusterStatus() {
        return {
            name: this.name,
            totalNodes: this.nodes.length,
            inputNodes: this.inputNodes.length,
            computeNodes: this.computeNodes.length,
            outputNodes: this.outputNodes.length,
            nodes: this.nodes.map(node => node.getStatus())
        };
    }

    simulate(iterations = 10) {
        const results = [];
        
        for (let i = 0; i < iterations; i++) {
            const testData = {
                iteration: i,
                type: 'simulation',
                value: Math.random() * 100
            };
            
            const result = this.process(testData);
            results.push(...result);
        }

        return {
            totalIterations: iterations,
            results: results,
            clusterStatus: this.getClusterStatus()
        };
    }
}

module.exports = { AnalyzerNode, AnalyzerCluster };
