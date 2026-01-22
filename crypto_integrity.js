/**
 * Cryptographic Integrity Checker
 * Implements SHA256 hashing and integrity verification
 */

class CryptoIntegrityChecker {
    constructor() {
        this.state = {
            checksums: new Map(),
            verificationLog: []
        };
    }
    
    /**
     * Calculate SHA256 hash (simplified version)
     * In production, use Web Crypto API: crypto.subtle.digest('SHA-256', data)
     */
    async calculateSHA256(data) {
        // Convert data to string
        const str = typeof data === 'string' ? data : JSON.stringify(data);
        
        // Check if Web Crypto API is available
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            try {
                const encoder = new TextEncoder();
                const dataBuffer = encoder.encode(str);
                const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                return hashHex;
            } catch (error) {
                // Fallback to simple hash
                return this.simpleHash(str);
            }
        } else {
            // Fallback to simple hash for non-browser environments
            return this.simpleHash(str);
        }
    }
    
    /**
     * Simple hash function (fallback)
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(64, '0');
    }
    
    /**
     * Generate checksum for data
     */
    async generateChecksum(data, identifier) {
        const checksum = await this.calculateSHA256(data);
        
        const record = {
            identifier: identifier,
            checksum: checksum,
            timestamp: Date.now(),
            dataSize: JSON.stringify(data).length
        };
        
        this.state.checksums.set(identifier, record);
        
        return record;
    }
    
    /**
     * Verify data integrity against stored checksum
     */
    async verifyIntegrity(data, identifier) {
        const storedRecord = this.state.checksums.get(identifier);
        
        if (!storedRecord) {
            return {
                valid: false,
                reason: 'No checksum found for identifier',
                identifier: identifier,
                timestamp: Date.now()
            };
        }
        
        const currentChecksum = await this.calculateSHA256(data);
        const matches = currentChecksum === storedRecord.checksum;
        
        const result = {
            valid: matches,
            identifier: identifier,
            expectedChecksum: storedRecord.checksum,
            actualChecksum: currentChecksum,
            originalTimestamp: storedRecord.timestamp,
            verificationTimestamp: Date.now()
        };
        
        // Log verification
        this.state.verificationLog.push(result);
        
        // Keep only last 1000 logs
        if (this.state.verificationLog.length > 1000) {
            this.state.verificationLog = this.state.verificationLog.slice(-1000);
        }
        
        return result;
    }
    
    /**
     * Verify data against expected checksum
     */
    async verifyAgainstChecksum(data, expectedChecksum) {
        const actualChecksum = await this.calculateSHA256(data);
        const matches = actualChecksum === expectedChecksum;
        
        return {
            valid: matches,
            expectedChecksum: expectedChecksum,
            actualChecksum: actualChecksum,
            timestamp: Date.now()
        };
    }
    
    /**
     * Generate HMAC (simplified version)
     */
    async generateHMAC(data, key) {
        const message = typeof data === 'string' ? data : JSON.stringify(data);
        const keyStr = typeof key === 'string' ? key : JSON.stringify(key);
        
        // Simple HMAC simulation
        const combined = keyStr + message + keyStr;
        return await this.calculateSHA256(combined);
    }
    
    /**
     * Verify HMAC
     */
    async verifyHMAC(data, key, expectedHMAC) {
        const actualHMAC = await this.generateHMAC(data, key);
        const matches = actualHMAC === expectedHMAC;
        
        return {
            valid: matches,
            expectedHMAC: expectedHMAC,
            actualHMAC: actualHMAC,
            timestamp: Date.now()
        };
    }
    
    /**
     * Create signed payload
     */
    async createSignedPayload(data, signingKey) {
        const payload = {
            data: data,
            timestamp: Date.now(),
            version: '1.0'
        };
        
        const signature = await this.generateHMAC(payload, signingKey);
        
        return {
            payload: payload,
            signature: signature
        };
    }
    
    /**
     * Verify signed payload
     */
    async verifySignedPayload(signedPayload, signingKey) {
        const { payload, signature } = signedPayload;
        const expectedSignature = await this.generateHMAC(payload, signingKey);
        
        return {
            valid: signature === expectedSignature,
            expectedSignature: expectedSignature,
            actualSignature: signature,
            timestamp: Date.now()
        };
    }
    
    /**
     * Get stored checksum
     */
    getChecksum(identifier) {
        const record = this.state.checksums.get(identifier);
        
        if (!record) {
            return {
                found: false,
                identifier: identifier
            };
        }
        
        return {
            found: true,
            ...record
        };
    }
    
    /**
     * List all checksums
     */
    listChecksums() {
        return Array.from(this.state.checksums.entries()).map(([id, record]) => ({
            identifier: id,
            checksum: record.checksum,
            timestamp: record.timestamp,
            dataSize: record.dataSize
        }));
    }
    
    /**
     * Get verification log
     */
    getVerificationLog(limit = 50) {
        return this.state.verificationLog.slice(-limit);
    }
    
    /**
     * Get status
     */
    getStatus() {
        const recentVerifications = this.state.verificationLog.slice(-10);
        const successfulVerifications = recentVerifications.filter(v => v.valid).length;
        
        return {
            totalChecksums: this.state.checksums.size,
            totalVerifications: this.state.verificationLog.length,
            recentSuccessRate: recentVerifications.length > 0 
                ? (successfulVerifications / recentVerifications.length) * 100 
                : 100,
            timestamp: Date.now()
        };
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CryptoIntegrityChecker;
}
