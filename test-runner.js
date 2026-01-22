// Load all modules
const ShythiaBlock = require('./shythia-block.js');
const EuystacioAI = require('./euystacio-ai.js');
const ApolloInterface = require('./apollo-interface.js');
const { BarbadosRootIntegration } = require('./barbados-integration.js');
const { runner } = require('./integration-tests.js');

// Run tests
runner.run().then(success => {
    process.exit(success ? 0 : 1);
});
