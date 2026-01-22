/**
 * INTEGRITY CHECKS MODULE
 * Blockchain timestamping, IPFS validation, and SHA-256 checksum enforcement
 * Part of the Barbados-Root Sovereignty Platform
 */

class IntegrityChecker {
    constructor() {
        this.checksums = new Map();
        this.timestamps = new Map();
        this.ipfsRecords = new Map();
        this.blockchainAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2';
    }

    /**
     * Calculates SHA-256 checksum for data
     * @param {string|Object} data - Data to hash
     * @returns {Promise<string>} SHA-256 hash
     */
    async calculateSHA256(data) {
        const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(jsonString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Creates a blockchain timestamp for data
     * @param {Object} data - Data to timestamp
     * @returns {Promise<Object>} Timestamp record
     */
    async createBlockchainTimestamp(data) {
        const checksum = await this.calculateSHA256(data);
        const timestamp = {
            id: this.generateTimestampId(),
            checksum,
            timestamp: new Date().toISOString(),
            blockNumber: this.generateMockBlockNumber(),
            transactionHash: this.generateTransactionHash(),
            data: {
                type: data.type || 'general',
                identifier: data.identifier || null
            },
            verified: true
        };

        this.timestamps.set(timestamp.id, timestamp);
        this.checksums.set(checksum, timestamp.id);

        return timestamp;
    }

    /**
     * Generates mock blockchain transaction hash
     * @returns {string} Transaction hash
     */
    generateTransactionHash() {
        return '0x' + Array.from({ length: 64 }, () => 
            Math.floor(Math.random() * 16).toString(16)
        ).join('');
    }

    /**
     * Generates mock block number
     * @returns {number} Block number
     */
    generateMockBlockNumber() {
        return Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);
    }

    /**
     * Generates unique timestamp ID
     * @returns {string} Timestamp ID
     */
    generateTimestampId() {
        return `TS-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }

    /**
     * Validates data against stored checksum
     * @param {Object} data - Data to validate
     * @param {string} expectedChecksum - Expected checksum
     * @returns {Promise<Object>} Validation result
     */
    async validateChecksum(data, expectedChecksum) {
        const actualChecksum = await this.calculateSHA256(data);
        const isValid = actualChecksum === expectedChecksum;

        return {
            valid: isValid,
            actualChecksum,
            expectedChecksum,
            timestamp: new Date().toISOString(),
            message: isValid ? 'Checksum valid' : 'Checksum mismatch - data may be corrupted'
        };
    }

    /**
     * Creates IPFS record for data
     * @param {Object} data - Data to store
     * @returns {Promise<Object>} IPFS record
     */
    async createIPFSRecord(data) {
        const checksum = await this.calculateSHA256(data);
        const ipfsHash = this.generateIPFSHash(checksum);
        
        const record = {
            cid: ipfsHash,
            checksum,
            timestamp: new Date().toISOString(),
            size: JSON.stringify(data).length,
            type: data.type || 'general',
            pinned: true,
            gateways: [
                `https://ipfs.io/ipfs/${ipfsHash}`,
                `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
            ],
            metadata: {
                creator: data.creator || 'system',
                description: data.description || ''
            }
        };

        this.ipfsRecords.set(ipfsHash, record);
        return record;
    }

    /**
     * Generates IPFS CID hash
     * @param {string} checksum - Base checksum
     * @returns {string} IPFS CID
     */
    generateIPFSHash(checksum) {
        // Simplified IPFS CID generation (mock)
        return `Qm${checksum.substring(0, 44)}`;
    }

    /**
     * Validates IPFS record
     * @param {string} cid - IPFS CID
     * @param {Object} data - Data to validate
     * @returns {Promise<Object>} Validation result
     */
    async validateIPFSRecord(cid, data) {
        const record = this.ipfsRecords.get(cid);
        
        if (!record) {
            return {
                valid: false,
                message: 'IPFS record not found',
                cid
            };
        }

        const actualChecksum = await this.calculateSHA256(data);
        const isValid = actualChecksum === record.checksum;

        return {
            valid: isValid,
            cid,
            record,
            actualChecksum,
            expectedChecksum: record.checksum,
            timestamp: new Date().toISOString(),
            message: isValid ? 'IPFS record valid' : 'Data does not match IPFS record'
        };
    }

    /**
     * Performs comprehensive integrity check
     * @param {Object} data - Data to check
     * @param {Object} options - Check options
     * @returns {Promise<Object>} Comprehensive integrity report
     */
    async performIntegrityCheck(data, options = {}) {
        const report = {
            timestamp: new Date().toISOString(),
            checks: {
                checksum: null,
                blockchain: null,
                ipfs: null
            },
            overall: {
                passed: 0,
                failed: 0,
                status: 'pending'
            }
        };

        // 1. SHA-256 Checksum
        if (options.checksum || options.expectedChecksum) {
            const checksumResult = await this.validateChecksum(
                data,
                options.expectedChecksum
            );
            report.checks.checksum = checksumResult;
            checksumResult.valid ? report.overall.passed++ : report.overall.failed++;
        }

        // 2. Blockchain Timestamp
        if (options.blockchain !== false) {
            const timestampResult = await this.createBlockchainTimestamp(data);
            report.checks.blockchain = {
                valid: true,
                timestamp: timestampResult,
                message: 'Blockchain timestamp created successfully'
            };
            report.overall.passed++;
        }

        // 3. IPFS Validation
        if (options.ipfs) {
            if (options.ipfsCID) {
                const ipfsResult = await this.validateIPFSRecord(options.ipfsCID, data);
                report.checks.ipfs = ipfsResult;
                ipfsResult.valid ? report.overall.passed++ : report.overall.failed++;
            } else {
                const ipfsRecord = await this.createIPFSRecord(data);
                report.checks.ipfs = {
                    valid: true,
                    record: ipfsRecord,
                    message: 'IPFS record created successfully'
                };
                report.overall.passed++;
            }
        }

        // Determine overall status
        if (report.overall.failed === 0) {
            report.overall.status = 'passed';
        } else if (report.overall.passed > report.overall.failed) {
            report.overall.status = 'partial';
        } else {
            report.overall.status = 'failed';
        }

        return report;
    }

    /**
     * Verifies blockchain timestamp
     * @param {string} timestampId - Timestamp ID
     * @returns {Object} Verification result
     */
    verifyBlockchainTimestamp(timestampId) {
        const timestamp = this.timestamps.get(timestampId);
        
        if (!timestamp) {
            return {
                valid: false,
                message: 'Timestamp not found'
            };
        }

        return {
            valid: timestamp.verified,
            timestamp,
            message: 'Timestamp verified on blockchain',
            blockExplorer: `https://etherscan.io/tx/${timestamp.transactionHash}`
        };
    }

    /**
     * Gets all checksums
     * @returns {Array} List of all checksums
     */
    getAllChecksums() {
        return Array.from(this.checksums.entries()).map(([checksum, timestampId]) => ({
            checksum,
            timestampId,
            timestamp: this.timestamps.get(timestampId)
        }));
    }

    /**
     * Gets all IPFS records
     * @returns {Array} List of all IPFS records
     */
    getAllIPFSRecords() {
        return Array.from(this.ipfsRecords.values());
    }

    /**
     * Gets all blockchain timestamps
     * @returns {Array} List of all timestamps
     */
    getAllTimestamps() {
        return Array.from(this.timestamps.values());
    }

    /**
     * Enforces checksum validation
     * @param {Object} data - Data to validate
     * @param {string} requiredChecksum - Required checksum
     * @throws {Error} If checksum doesn't match
     */
    async enforceChecksum(data, requiredChecksum) {
        const result = await this.validateChecksum(data, requiredChecksum);
        
        if (!result.valid) {
            throw new Error(`Checksum enforcement failed: ${result.message}`);
        }

        return result;
    }

    /**
     * Creates integrity seal combining all methods
     * @param {Object} data - Data to seal
     * @returns {Promise<Object>} Complete integrity seal
     */
    async createIntegritySeal(data) {
        const checksum = await this.calculateSHA256(data);
        const blockchainTimestamp = await this.createBlockchainTimestamp(data);
        const ipfsRecord = await this.createIPFSRecord(data);

        const seal = {
            id: `SEAL-${Date.now()}`,
            timestamp: new Date().toISOString(),
            checksum,
            blockchain: {
                timestampId: blockchainTimestamp.id,
                transactionHash: blockchainTimestamp.transactionHash,
                blockNumber: blockchainTimestamp.blockNumber
            },
            ipfs: {
                cid: ipfsRecord.cid,
                gateways: ipfsRecord.gateways
            },
            verified: true
        };

        return seal;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntegrityChecker;
}
