#!/usr/bin/env node
/**
 * Node.js Test Runner for Barbados Root System
 */

// Load all modules
const EuystacioLock = require('./euystacio_lock.js');
const NSRBinaryLogic = require('./nsr_binary_logic.js');
const VBBridge = require('./vb_bridge.js');
const ResonanceEnforcement = require('./resonance_enforcement.js');
const IPFSValidator = require('./ipfs_validator.js');
const BlockchainVerifier = require('./blockchain_verifier.js');
const CryptoIntegrityChecker = require('./crypto_integrity.js');
const BarbadosRootSystem = require('./barbados_root_system.js');

// Make classes global for test suite
global.EuystacioLock = EuystacioLock;
global.NSRBinaryLogic = NSRBinaryLogic;
global.VBBridge = VBBridge;
global.ResonanceEnforcement = ResonanceEnforcement;
global.IPFSValidator = IPFSValidator;
global.BlockchainVerifier = BlockchainVerifier;
global.CryptoIntegrityChecker = CryptoIntegrityChecker;
global.BarbadosRootSystem = BarbadosRootSystem;

// Load and run tests
const runner = require('./test_suite.js');

// Execute tests
runner.run().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
});
