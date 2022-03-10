import { createHash } from 'crypto'; // Import NodeJS's Crypto Module
import Transaction from './transaction.mjs';

class Block { // Our Block Class
    /**
     * Create a new Block with a Transcation
     * @param {Transaction} trx 
     * @param {String} prevHash 
     */
    constructor(trxs, prevHash = "") {
        this.nonce = 0;
        this.timestamp = Date.now(); // Get the current timestamp
        this.trxs = trxs; // Store whatever data is relevant 
        this.prevHash = prevHash // Store the previous block's hash
        this.hash = this.computeHash() // Compute this block's hash
    }

    computeHash() { // Compute this Block's hash
        let strBlock = this.prevHash + this.timestamp + JSON.stringify(this.trx) // Stringify the block's data
        return createHash("sha256").update(strBlock).digest("hex") // Hash said string with SHA256 encrpytion
    }

}

export default Block;