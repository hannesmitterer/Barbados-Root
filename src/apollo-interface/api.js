/**
 * Apollo Interface - API Endpoints
 * RESTful API structure for external integration
 */

class ApolloAPI {
    constructor(apolloInterface) {
        this.apollo = apolloInterface;
        this.routes = new Map();
        this.setupRoutes();
    }

    setupRoutes() {
        // Health check
        this.addRoute('GET', '/health', () => {
            return this.apollo.getHealthStatus();
        });

        // System status
        this.addRoute('GET', '/status', () => {
            return this.apollo.getSystemStatus();
        });

        // Blockchain endpoints
        this.addRoute('GET', '/blockchain/validate', () => {
            return this.apollo.validateBlockchain();
        });

        this.addRoute('POST', '/blockchain/block', (data) => {
            if (!data || !data.blockData) {
                throw new Error('Missing block data');
            }
            return this.apollo.addBlock(data.blockData);
        });

        // AI endpoints
        this.addRoute('POST', '/ai/predict', (data) => {
            if (!data) {
                throw new Error('Missing input data for prediction');
            }
            return this.apollo.runPrediction(data);
        });

        this.addRoute('GET', '/ai/models', () => {
            if (!this.apollo.aiConnector) {
                throw new Error('AI connector not initialized');
            }
            return this.apollo.aiConnector.getAllModels();
        });

        // Integrated workflow
        this.addRoute('POST', '/workflow/process', (data) => {
            return this.apollo.processIntegratedWorkflow(data);
        });
    }

    addRoute(method, path, handler) {
        const key = `${method} ${path}`;
        this.routes.set(key, handler);
    }

    handleRequest(method, path, data = null) {
        const key = `${method} ${path}`;
        
        if (!this.routes.has(key)) {
            return {
                status: 404,
                error: 'Route not found',
                path: path
            };
        }

        try {
            const handler = this.routes.get(key);
            const result = handler(data);
            
            return {
                status: 200,
                data: result
            };
        } catch (error) {
            return {
                status: 500,
                error: error.message
            };
        }
    }

    getRoutes() {
        return Array.from(this.routes.keys());
    }
}

module.exports = { ApolloAPI };
