import Block from "./block.mjs"
import Transaction from "./transaction.mjs";

let initialTransactions = [
    new Transaction("john", "alice", 10),
    new Transaction("greg", "mike", 5),
    new Transaction("juliet", "grace", 1),
    new Transaction("leonard", "john", 12),
];

class BlockChain { // Our Blockchain Object
    #blockchain;
    #target;

    constructor() {
        this.#target = 6;
        this.#blockchain = [this.startGenesisBlock()] // Initialize a new array of blocks, starting with a genesis block
    }

    getTarget() {
        return this.#target;
    }

    startGenesisBlock() {

        return new Block(initialTransactions) // Create an empty block to start
    }

    obtainLatestBlock() {
        return this.#blockchain[this.#blockchain.length - 1] // Get last block on the chain
    }

    getBlockByIndex(index) {
        if (0 > index || index >= this.#blockchain.length)
            throw new Error("IndexOutOfBounds");

        return this.#blockchain[index];
    }

    getAllBlocks() {
        return [...this.#blockchain];
    }

    addNewBlock(newBlock) { // Add a new block
        let latestBlock = this.obtainLatestBlock();

        if (newBlock.prevHash !== latestBlock.hash)
            throw new Error("hash of previous block does not match");

        if (newBlock.hash !== newBlock.computeHash())
            throw new Error("hash has been tempered with");



        this.#blockchain.push(newBlock) // Add the block to our chain
    }

    checkChainValidity() { // Check to see that all the hashes are correct and the chain is therefore valid
        for (let i = 1; i < this.#blockchain.length; i++) { // Iterate through, starting after the genesis block
            const currBlock = this.#blockchain[i]
            const prevBlock = this.#blockchain[i - 1]

            // Is the hash correctly computed, or was it tampered with?
            if (currBlock.hash !== currBlock.computeHash()) {
                return false
            }

            // Does it have the correct prevHash value?; ie: What a previous block tampered with?
            if (currBlock.prevHash !== prevBlock.hash) {
                return false
            }

        }
        return true // If all the blocks are valid, return true
    }
}

let chain = new BlockChain() // Init our chain

export default chain;