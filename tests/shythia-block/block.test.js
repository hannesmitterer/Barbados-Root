/**
 * Tests for Shythia Block - Blockchain validation
 */

const { ShythiaBlock, ShythiaBlockchain } = require('../../src/shythia-block/block');

describe('ShythiaBlock', () => {
    test('should create a valid block', () => {
        const block = new ShythiaBlock(1, Date.now(), { test: 'data' }, '0');
        expect(block.index).toBe(1);
        expect(block.data).toEqual({ test: 'data' });
        expect(block.hash).toBeDefined();
    });

    test('should calculate hash correctly', () => {
        const block = new ShythiaBlock(1, Date.now(), { test: 'data' }, '0');
        const calculatedHash = block.calculateHash();
        expect(calculatedHash).toBe(block.hash);
    });

    test('should validate block integrity', () => {
        const block = new ShythiaBlock(1, Date.now(), { test: 'data' }, '0');
        expect(block.isValid()).toBe(true);
    });

    test('should invalidate tampered block', () => {
        const block = new ShythiaBlock(1, Date.now(), { test: 'data' }, '0');
        block.data = { test: 'tampered' };
        expect(block.isValid()).toBe(false);
    });
});

describe('ShythiaBlockchain', () => {
    let blockchain;

    beforeEach(() => {
        blockchain = new ShythiaBlockchain();
    });

    test('should create blockchain with genesis block', () => {
        expect(blockchain.chain.length).toBe(1);
        expect(blockchain.chain[0].previousHash).toBe('0');
    });

    test('should add new block to chain', () => {
        const newBlock = new ShythiaBlock(1, Date.now(), { amount: 100 });
        blockchain.addBlock(newBlock);
        expect(blockchain.chain.length).toBe(2);
    });

    test('should validate entire blockchain', () => {
        const block1 = new ShythiaBlock(1, Date.now(), { amount: 100 });
        const block2 = new ShythiaBlock(2, Date.now(), { amount: 200 });
        
        blockchain.addBlock(block1);
        blockchain.addBlock(block2);
        
        expect(blockchain.isChainValid()).toBe(true);
    });

    test('should detect invalid blockchain', () => {
        const block1 = new ShythiaBlock(1, Date.now(), { amount: 100 });
        blockchain.addBlock(block1);
        
        // Tamper with the block
        blockchain.chain[1].data = { amount: 999 };
        
        expect(blockchain.isChainValid()).toBe(false);
    });

    test('should get latest block', () => {
        const block1 = new ShythiaBlock(1, Date.now(), { amount: 100 });
        blockchain.addBlock(block1);
        
        const latest = blockchain.getLatestBlock();
        expect(latest.index).toBe(1);
    });
});
