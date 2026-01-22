/**
 * Tests for Shythia Block - Transaction validation
 */

const { Transaction, TransactionValidator } = require('../../src/shythia-block/transaction');

describe('Transaction', () => {
    test('should create a valid transaction', () => {
        const tx = new Transaction('address1', 'address2', 100);
        expect(tx.fromAddress).toBe('address1');
        expect(tx.toAddress).toBe('address2');
        expect(tx.amount).toBe(100);
        expect(tx.timestamp).toBeDefined();
    });

    test('should calculate transaction hash', () => {
        const tx = new Transaction('address1', 'address2', 100);
        const hash = tx.calculateHash();
        expect(hash).toBeDefined();
        expect(hash.length).toBe(64); // SHA-256 produces 64 hex characters
    });

    test('should have consistent hash for same transaction', () => {
        const tx = new Transaction('address1', 'address2', 100, 1234567890);
        const hash1 = tx.calculateHash();
        const hash2 = tx.calculateHash();
        expect(hash1).toBe(hash2);
    });
});

describe('TransactionValidator', () => {
    test('should validate transaction structure with all fields', () => {
        const tx = new Transaction('address1', 'address2', 100);
        const result = TransactionValidator.validateStructure(tx);
        expect(result.valid).toBe(true);
    });

    test('should reject transaction without fromAddress', () => {
        const tx = { toAddress: 'address2', amount: 100, timestamp: Date.now() };
        const result = TransactionValidator.validateStructure(tx);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Missing address fields');
    });

    test('should reject transaction without toAddress', () => {
        const tx = { fromAddress: 'address1', amount: 100, timestamp: Date.now() };
        const result = TransactionValidator.validateStructure(tx);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Missing address fields');
    });

    test('should reject transaction with invalid amount', () => {
        const tx = { 
            fromAddress: 'address1', 
            toAddress: 'address2', 
            amount: -100, 
            timestamp: Date.now() 
        };
        const result = TransactionValidator.validateStructure(tx);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid amount');
    });

    test('should reject transaction with zero amount', () => {
        const tx = { 
            fromAddress: 'address1', 
            toAddress: 'address2', 
            amount: 0, 
            timestamp: Date.now() 
        };
        const result = TransactionValidator.validateStructure(tx);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Invalid amount');
    });

    test('should reject transaction without timestamp', () => {
        const tx = { 
            fromAddress: 'address1', 
            toAddress: 'address2', 
            amount: 100 
        };
        const result = TransactionValidator.validateStructure(tx);
        expect(result.valid).toBe(false);
        expect(result.error).toBe('Missing timestamp');
    });
});
