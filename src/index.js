/**
 * Barbados-Root - Main Integration Module
 * Unified system for Shythia Block, Euystacio-AI, and Apollo Interface
 */

const { ShythiaBlockchain, ShythiaBlock } = require('./shythia-block/block');
const { Transaction, TransactionValidator } = require('./shythia-block/transaction');
const { AnalyzerCluster, AnalyzerNode } = require('./euystacio-ai/analyzer');
const { PredictionEngine } = require('./euystacio-ai/prediction');
const { ApolloInterface } = require('./apollo-interface/interface');
const { ApolloAPI } = require('./apollo-interface/api');

class BarbadosRoot {
    constructor(config = {}) {
        this.config = {
            blockchainDifficulty: config.blockchainDifficulty || 2,
            clusterName: config.clusterName || 'Euystacio-Primary',
            apolloVersion: config.apolloVersion || '1.0.0',
            verbose: config.verbose !== undefined ? config.verbose : true,
            ...config
        };

        this.blockchain = null;
        this.aiEngine = null;
        this.cluster = null;
        this.apollo = null;
        this.api = null;
        this.initialized = false;
    }

    log(message) {
        if (this.config.verbose) {
            console.log(message);
        }
    }

    async initialize() {
        this.log('Initializing Barbados-Root System...');

        // Initialize Shythia Blockchain
        this.blockchain = new ShythiaBlockchain();
        this.blockchain.difficulty = this.config.blockchainDifficulty;
        this.log('✓ Shythia Block initialized');

        // Initialize Euystacio AI
        this.aiEngine = new PredictionEngine();
        this.aiEngine.registerModel('resonance', { 
            type: 'resonance', 
            nsr: true, 
            olf: true 
        });
        this.log('✓ Euystacio-AI initialized');

        // Initialize Analyzer Cluster
        this.cluster = new AnalyzerCluster(this.config.clusterName);
        this.cluster.createNode('input-primary', 'input');
        this.cluster.createNode('compute-primary', 'compute');
        this.cluster.createNode('compute-secondary', 'compute');
        this.cluster.createNode('output-primary', 'output');
        this.log('✓ Analyzer Cluster initialized');

        // Initialize Apollo Interface
        this.apollo = new ApolloInterface();
        this.apollo.initialize(this.blockchain, this.aiEngine);
        this.log('✓ Apollo Interface initialized');

        // Initialize Apollo API
        this.api = new ApolloAPI(this.apollo);
        this.log('✓ Apollo API initialized');

        this.initialized = true;
        this.log('✓ Barbados-Root System ready');

        return this.getSystemStatus();
    }

    processTransaction(fromAddress, toAddress, amount) {
        if (!this.initialized) {
            throw new Error('System not initialized. Call initialize() first.');
        }

        // Create and validate transaction
        const transaction = new Transaction(fromAddress, toAddress, amount);
        const validation = TransactionValidator.validateStructure(transaction);

        if (!validation.valid) {
            throw new Error(`Invalid transaction: ${validation.error}`);
        }

        // Process through cluster
        const clusterResult = this.cluster.process({
            type: 'transaction',
            transaction: transaction
        });

        // Make AI prediction
        const prediction = this.aiEngine.predict('resonance', clusterResult[0]);

        // Add to blockchain
        const block = new ShythiaBlock(
            this.blockchain.chain.length,
            Date.now(),
            {
                transaction: transaction,
                prediction: prediction
            }
        );
        this.blockchain.addBlock(block);

        return {
            transaction: transaction,
            clusterProcessing: clusterResult,
            aiPrediction: prediction,
            block: block,
            blockchainValid: this.blockchain.isChainValid()
        };
    }

    getSystemStatus() {
        const status = {
            initialized: this.initialized,
            timestamp: Date.now()
        };

        if (this.initialized) {
            status.blockchain = {
                blocks: this.blockchain.chain.length,
                valid: this.blockchain.isChainValid(),
                difficulty: this.blockchain.difficulty
            };

            status.ai = {
                models: this.aiEngine.getAllModels().length,
                predictions: this.aiEngine.history.length
            };

            status.cluster = this.cluster.getClusterStatus();

            status.apollo = this.apollo.getSystemStatus();
        }

        return status;
    }

    async runSimulation(iterations = 10) {
        if (!this.initialized) {
            await this.initialize();
        }

        this.log(`\nRunning ${iterations} transaction simulations...`);
        const results = [];

        for (let i = 0; i < iterations; i++) {
            const result = this.processTransaction(
                `address-${i}`,
                `address-${i + 1}`,
                (i + 1) * 100
            );
            results.push(result);
            this.log(`  Transaction ${i + 1}/${iterations} processed`);
        }

        this.log('✓ Simulation complete');

        return {
            totalTransactions: iterations,
            results: results,
            systemStatus: this.getSystemStatus()
        };
    }
}

// Export all modules
module.exports = {
    BarbadosRoot,
    // Shythia Block
    ShythiaBlockchain,
    ShythiaBlock,
    Transaction,
    TransactionValidator,
    // Euystacio AI
    AnalyzerCluster,
    AnalyzerNode,
    PredictionEngine,
    // Apollo Interface
    ApolloInterface,
    ApolloAPI
};

// CLI entry point
if (require.main === module) {
    const system = new BarbadosRoot();
    
    system.initialize()
        .then(() => system.runSimulation(5))
        .then(results => {
            console.log('\nSimulation Results:');
            console.log(JSON.stringify(results.systemStatus, null, 2));
        })
        .catch(err => {
            console.error('Error:', err.message);
            process.exit(1);
        });
}
