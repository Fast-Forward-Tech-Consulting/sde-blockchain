import { createHash } from 'crypto'; // Import NodeJS's Crypto Module
import Transaction from './transaction.mjs';

class Block { // Our Block Class
    /**
     * Create a new Block with a Transcation
     * @param {Transaction} trx 
     * @param {String} prevHash 
     */
    constructor(trxs, nonce = 0, timestamp = Date.now(), prevHash = "", minedBy = "blockchain") {
        this.nonce = nonce;
        this.timestamp = timestamp;
        this.trxs = trxs; // Store whatever data is relevant 
        this.prevHash = prevHash // Store the previous block's hash
        this.minedBy = minedBy;
        this.hash = this.computeHash() // Compute this block's hash
    }

    computeHash() { // Compute this Block's hash
        let strBlock = this.nonce + this.prevHash + this.timestamp + this.minedBy + JSON.stringify(this.trx) // Stringify the block's data
        return createHash("sha256").update(strBlock).digest("hex") // Hash said string with SHA256 encrpytion
    }

    validate(prevHash, target) {
        if (this.prevHash !== prevHash) {
            console.log(`Blockchain - 🐢 Block from Miner #${this.minedBy} not following the most recent Block`);
            throw new Error("Block not following the last Block");
        }

        if (!this.hash.startsWith("0".repeat(target))) {
            console.log(`Blockchain - 🛑 Block from Miner #${this.minedBy} is not meeting hash target`);
            throw new Error("Block is not meeting Hash target");
        }

        return true;
    }

}

export default Block;