/**
 * PEACEBONDS LOGIC MODULE
 * Blockchain-based digital financial instruments
 * Part of the Barbados-Root Sovereignty Platform
 */

class PeacebondManager {
    constructor() {
        this.peacebonds = new Map();
        this.blockchainAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb2'; // Seedbringer Treasury
    }

    /**
     * Creates a new Peacebond digital financial instrument
     * @param {Object} metadata - Peacebond metadata
     * @returns {Object} Created peacebond
     */
    createPeacebond(metadata) {
        const peacebond = {
            id: this.generateId(),
            timestamp: new Date().toISOString(),
            blockchainHash: this.calculateHash(metadata),
            metadata: {
                issuer: metadata.issuer || 'Resonance School',
                purpose: metadata.purpose || 'Peace Enhancement',
                amount: metadata.amount || 0,
                currency: metadata.currency || 'CR', // Credito di Risonanza
                redemptionMechanism: metadata.redemptionMechanism || 'frequency-based',
                validUntil: metadata.validUntil || null,
                beneficiary: metadata.beneficiary || null,
                conditions: metadata.conditions || [],
                status: 'active'
            },
            signatures: [],
            ipfsHash: null
        };

        this.peacebonds.set(peacebond.id, peacebond);
        return peacebond;
    }

    /**
     * Generates a unique ID for peacebonds
     * @returns {string} Unique identifier
     */
    generateId() {
        return `PB-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }

    /**
     * Calculates blockchain hash for metadata
     * @param {Object} data - Data to hash
     * @returns {string} Hash value
     */
    async calculateHash(data) {
        const jsonString = JSON.stringify(data);
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(jsonString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Signs a peacebond with digital signature
     * @param {string} peacebondId - Peacebond ID
     * @param {Object} signatureData - Signature information
     */
    signPeacebond(peacebondId, signatureData) {
        const peacebond = this.peacebonds.get(peacebondId);
        if (!peacebond) {
            throw new Error('Peacebond not found');
        }

        peacebond.signatures.push({
            signer: signatureData.signer,
            signature: signatureData.signature,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Redeems a peacebond based on conditions
     * @param {string} peacebondId - Peacebond ID
     * @param {Object} redemptionData - Redemption information
     * @returns {Object} Redemption result
     */
    redeemPeacebond(peacebondId, redemptionData) {
        const peacebond = this.peacebonds.get(peacebondId);
        if (!peacebond) {
            throw new Error('Peacebond not found');
        }

        if (peacebond.metadata.status !== 'active') {
            throw new Error('Peacebond is not active');
        }

        // Validate redemption conditions
        const conditionsMet = this.validateRedemptionConditions(
            peacebond.metadata.conditions,
            redemptionData
        );

        if (conditionsMet) {
            peacebond.metadata.status = 'redeemed';
            peacebond.redemptionData = {
                redeemedBy: redemptionData.redeemer,
                redeemedAt: new Date().toISOString(),
                transactionHash: this.generateTransactionHash()
            };
            return {
                success: true,
                peacebond,
                message: 'Peacebond successfully redeemed'
            };
        }

        return {
            success: false,
            message: 'Redemption conditions not met'
        };
    }

    /**
     * Validates redemption conditions
     * @param {Array} conditions - Conditions to validate
     * @param {Object} data - Data to validate against
     * @returns {boolean} Whether conditions are met
     */
    validateRedemptionConditions(conditions, data) {
        // Simplified validation - can be extended
        return conditions.every(condition => {
            switch (condition.type) {
                case 'frequency':
                    return data.frequency >= condition.minimumFrequency;
                case 'time':
                    return new Date() >= new Date(condition.afterDate);
                case 'peace_index':
                    return data.peaceIndex >= condition.minimumPeaceIndex;
                default:
                    return true;
            }
        });
    }

    /**
     * Generates a mock transaction hash
     * @returns {string} Transaction hash
     */
    generateTransactionHash() {
        return '0x' + Array.from({ length: 64 }, () => 
            Math.floor(Math.random() * 16).toString(16)
        ).join('');
    }

    /**
     * Gets all peacebonds
     * @returns {Array} List of all peacebonds
     */
    getAllPeacebonds() {
        return Array.from(this.peacebonds.values());
    }

    /**
     * Gets a specific peacebond by ID
     * @param {string} peacebondId - Peacebond ID
     * @returns {Object} Peacebond data
     */
    getPeacebond(peacebondId) {
        return this.peacebonds.get(peacebondId);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PeacebondManager;
}
