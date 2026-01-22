/**
 * SHYTHIA BLOCK - Advanced Computational Ledger Layer
 * 
 * Supports high-frequency transaction metrics with data governance protocols
 * enforcing integrity checks and sovereign enforcement logs.
 * 
 * @module ShythiaBlock
 */

class ShythiaBlock {
    constructor(config = {}) {
        this.config = {
            maxTransactionsPerBlock: config.maxTransactionsPerBlock || 1000,
            integrityCheckInterval: config.integrityCheckInterval || 5000,
            sovereignNode: config.sovereignNode || 'BARBADOS-ROOT',
            ...config
        };
        
        this.transactions = [];
        this.blocks = [];
        this.enforcementLogs = [];
        this.metrics = {
            totalTransactions: 0,
            blocksCreated: 0,
            integrityChecks: 0,
            integrityScore: 100.0,
            lastCheckTimestamp: null
        };
        
        this.init();
    }
    
    init() {
        console.log(`[ShythiaBlock] Initializing on node: ${this.config.sovereignNode}`);
        this.startIntegrityMonitoring();
    }
    
    /**
     * Add a transaction to the pending pool
     * @param {Object} transaction - Transaction data
     * @returns {string} Transaction ID
     */
    addTransaction(transaction) {
        const txId = this.generateTransactionId();
        const enrichedTx = {
            id: txId,
            timestamp: Date.now(),
            sovereignNode: this.config.sovereignNode,
            integrityHash: this.computeIntegrityHash(transaction),
            ...transaction
        };
        
        this.transactions.push(enrichedTx);
        this.metrics.totalTransactions++;
        
        // Auto-seal block if threshold reached
        if (this.transactions.length >= this.config.maxTransactionsPerBlock) {
            this.sealBlock();
        }
        
        this.logEnforcement('TRANSACTION_ADDED', { txId, node: this.config.sovereignNode });
        return txId;
    }
    
    /**
     * Seal current transactions into a new block
     * @returns {Object} Sealed block
     */
    sealBlock() {
        if (this.transactions.length === 0) {
            console.warn('[ShythiaBlock] No transactions to seal');
            return null;
        }
        
        const block = {
            blockId: this.generateBlockId(),
            timestamp: Date.now(),
            transactionCount: this.transactions.length,
            transactions: [...this.transactions],
            previousBlockHash: this.blocks.length > 0 ? this.blocks[this.blocks.length - 1].blockHash : '0x0',
            sovereignNode: this.config.sovereignNode,
            blockHash: null
        };
        
        // Compute block hash
        block.blockHash = this.computeBlockHash(block);
        
        this.blocks.push(block);
        this.transactions = [];
        this.metrics.blocksCreated++;
        
        this.logEnforcement('BLOCK_SEALED', { 
            blockId: block.blockId, 
            txCount: block.transactionCount,
            hash: block.blockHash
        });
        
        return block;
    }
    
    /**
     * Perform integrity check on the ledger
     * @returns {Object} Integrity report
     */
    performIntegrityCheck() {
        this.metrics.integrityChecks++;
        this.metrics.lastCheckTimestamp = Date.now();
        
        const report = {
            timestamp: this.metrics.lastCheckTimestamp,
            totalBlocks: this.blocks.length,
            chainValid: true,
            integrityScore: 100.0,
            issues: []
        };
        
        // Verify blockchain integrity
        for (let i = 1; i < this.blocks.length; i++) {
            const currentBlock = this.blocks[i];
            const previousBlock = this.blocks[i - 1];
            
            // Check if previous hash matches
            if (currentBlock.previousBlockHash !== previousBlock.blockHash) {
                report.chainValid = false;
                report.issues.push({
                    type: 'CHAIN_BREAK',
                    blockId: currentBlock.blockId,
                    message: 'Previous hash mismatch'
                });
            }
            
            // Verify block hash
            const recomputedHash = this.computeBlockHash({...currentBlock, blockHash: null});
            if (recomputedHash !== currentBlock.blockHash) {
                report.chainValid = false;
                report.issues.push({
                    type: 'HASH_CORRUPTION',
                    blockId: currentBlock.blockId,
                    message: 'Block hash corruption detected'
                });
            }
        }
        
        // Calculate integrity score
        if (report.issues.length > 0) {
            report.integrityScore = Math.max(0, 100 - (report.issues.length * 10));
        }
        
        this.metrics.integrityScore = report.integrityScore;
        
        this.logEnforcement('INTEGRITY_CHECK', {
            score: report.integrityScore,
            issues: report.issues.length,
            valid: report.chainValid
        });
        
        return report;
    }
    
    /**
     * Start automatic integrity monitoring
     */
    startIntegrityMonitoring() {
        setInterval(() => {
            this.performIntegrityCheck();
        }, this.config.integrityCheckInterval);
        
        console.log(`[ShythiaBlock] Integrity monitoring started (${this.config.integrityCheckInterval}ms interval)`);
    }
    
    /**
     * Get current metrics
     * @returns {Object} Current metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            pendingTransactions: this.transactions.length,
            enforcementLogCount: this.enforcementLogs.length
        };
    }
    
    /**
     * Get enforcement logs
     * @param {number} limit - Maximum number of logs to return
     * @returns {Array} Enforcement logs
     */
    getEnforcementLogs(limit = 100) {
        return this.enforcementLogs.slice(-limit);
    }
    
    /**
     * Log sovereign enforcement event
     * @param {string} eventType - Type of enforcement event
     * @param {Object} data - Event data
     */
    logEnforcement(eventType, data) {
        const log = {
            timestamp: Date.now(),
            eventType,
            sovereignNode: this.config.sovereignNode,
            data
        };
        
        this.enforcementLogs.push(log);
        
        // Keep only last 10000 logs
        if (this.enforcementLogs.length > 10000) {
            this.enforcementLogs = this.enforcementLogs.slice(-10000);
        }
    }
    
    /**
     * Generate unique transaction ID
     * @returns {string} Transaction ID
     */
    generateTransactionId() {
        return `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Generate unique block ID
     * @returns {string} Block ID
     */
    generateBlockId() {
        return `BLK-${Date.now()}-${this.blocks.length}`;
    }
    
    /**
     * Compute integrity hash for transaction
     * @param {Object} data - Transaction data
     * @returns {string} Integrity hash
     */
    computeIntegrityHash(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return `0x${Math.abs(hash).toString(16).padStart(16, '0')}`;
    }
    
    /**
     * Compute block hash
     * @param {Object} block - Block data (without blockHash)
     * @returns {string} Block hash
     */
    computeBlockHash(block) {
        const blockCopy = {...block};
        delete blockCopy.blockHash;
        return this.computeIntegrityHash(blockCopy);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShythiaBlock;
}
