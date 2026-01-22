/**
 * Shythia Block - Transaction Management and Validation
 * Handles blockchain transactions with validation
 */

const crypto = require('crypto');

class Transaction {
    constructor(fromAddress, toAddress, amount, timestamp = Date.now()) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = timestamp;
        this.signature = null;
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.fromAddress +
                this.toAddress +
                this.amount +
                this.timestamp
            )
            .digest('hex');
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (this.fromAddress === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        const EC = require('elliptic').ec;
        const ec = new EC('secp256k1');
        const key = ec.keyFromPublic(this.fromAddress, 'hex');
        return key.verify(this.calculateHash(), this.signature);
    }
}

class TransactionValidator {
    static validateStructure(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            return { valid: false, error: 'Missing address fields' };
        }

        if (typeof transaction.amount !== 'number' || transaction.amount <= 0) {
            return { valid: false, error: 'Invalid amount' };
        }

        if (!transaction.timestamp) {
            return { valid: false, error: 'Missing timestamp' };
        }

        return { valid: true };
    }

    static validateSignature(transaction) {
        try {
            return { valid: transaction.isValid() };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    static validateTransaction(transaction) {
        const structureValidation = this.validateStructure(transaction);
        if (!structureValidation.valid) {
            return structureValidation;
        }

        const signatureValidation = this.validateSignature(transaction);
        return signatureValidation;
    }
}

module.exports = { Transaction, TransactionValidator };
