/**
 * Tests for Euystacio-AI - Analyzer Cluster
 */

const { AnalyzerNode, AnalyzerCluster } = require('../../src/euystacio-ai/analyzer');

describe('AnalyzerNode', () => {
    test('should create a node with correct properties', () => {
        const node = new AnalyzerNode('node-1', 'compute');
        expect(node.id).toBe('node-1');
        expect(node.type).toBe('compute');
        expect(node.status).toBe('idle');
    });

    test('should process input data', () => {
        const node = new AnalyzerNode('node-1', 'input');
        const input = { value: 42 };
        const result = node.processInput(input);
        
        expect(result.processed).toBe(true);
        expect(result.value).toBe(42);
        expect(result.timestamp).toBeDefined();
    });

    test('should compute metrics for compute node', () => {
        const node = new AnalyzerNode('node-1', 'compute');
        const input = { value: 100 };
        const result = node.processInput(input);
        
        expect(result.computed).toBe(true);
        expect(result.result).toBeDefined();
        expect(result.result.nsr_drift).toBe(0.000);
        expect(result.result.olf_score).toBe(0.870);
    });

    test('should format output for output node', () => {
        const node = new AnalyzerNode('node-1', 'output');
        const input = { value: 200 };
        const result = node.processInput(input);
        
        expect(result.finalized).toBe(true);
        expect(result.output).toBeDefined();
        expect(result.output.nodeId).toBe('node-1');
    });

    test('should return node status', () => {
        const node = new AnalyzerNode('node-1', 'compute');
        const status = node.getStatus();
        
        expect(status.id).toBe('node-1');
        expect(status.type).toBe('compute');
        expect(status.status).toBe('idle');
    });
});

describe('AnalyzerCluster', () => {
    let cluster;

    beforeEach(() => {
        cluster = new AnalyzerCluster('Test-Cluster');
    });

    test('should create cluster with name', () => {
        expect(cluster.name).toBe('Test-Cluster');
        expect(cluster.nodes.length).toBe(0);
    });

    test('should add nodes to cluster', () => {
        const node1 = new AnalyzerNode('n1', 'input');
        const node2 = new AnalyzerNode('n2', 'compute');
        
        cluster.addNode(node1);
        cluster.addNode(node2);
        
        expect(cluster.nodes.length).toBe(2);
        expect(cluster.inputNodes.length).toBe(1);
        expect(cluster.computeNodes.length).toBe(1);
    });

    test('should create nodes with factory method', () => {
        cluster.createNode('n1', 'input');
        cluster.createNode('n2', 'compute');
        cluster.createNode('n3', 'output');
        
        expect(cluster.nodes.length).toBe(3);
    });

    test('should process data through cluster', () => {
        cluster.createNode('n1', 'input');
        cluster.createNode('n2', 'compute');
        cluster.createNode('n3', 'output');
        
        const results = cluster.process({ value: 100 });
        
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].finalized).toBe(true);
    });

    test('should return cluster status', () => {
        cluster.createNode('n1', 'input');
        cluster.createNode('n2', 'compute');
        
        const status = cluster.getClusterStatus();
        
        expect(status.name).toBe('Test-Cluster');
        expect(status.totalNodes).toBe(2);
        expect(status.nodes.length).toBe(2);
    });

    test('should simulate multiple iterations', () => {
        cluster.createNode('n1', 'input');
        cluster.createNode('n2', 'compute');
        cluster.createNode('n3', 'output');
        
        const simulation = cluster.simulate(5);
        
        expect(simulation.totalIterations).toBe(5);
        expect(simulation.results.length).toBe(5);
        expect(simulation.clusterStatus).toBeDefined();
    });
});
