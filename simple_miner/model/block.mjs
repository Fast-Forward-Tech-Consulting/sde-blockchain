import { createHash } from 'crypto'; // Import NodeJS's Crypto Module

class Block { // Our Block Class
    /**
     * Create a new Block with a Transcation
     * @param {Transaction} trx 
     * @param {String} prevHash 
     */
    constructor(trxs, prevHash = "", minerId, nonce = 0, timestamp = Date.now()) {
        this.trxs = trxs; // Store whatever data is relevant 
        this.prevHash = prevHash // Store the previous block's hash
        this.minedBy = minerId;
        this.nonce = nonce;
        this.timestamp = timestamp;
        this.hash = this.computeHash() // Compute this block's hash
    }

    computeHash() { // Compute this Block's hash
        let strBlock = this.nonce + this.prevHash + this.timestamp + this.minedBy + JSON.stringify(this.trx) // Stringify the block's data
        return createHash("sha256").update(strBlock).digest("hex") // Hash said string with SHA256 encrpytion
    }

    /**
     * Find a nonce to have the hash fit the target
     * @param {Number} Number of leading zeros required for the hash
     */
    mine(target) {
        while (!this.hash.startsWith("0".repeat(target))) {
            this.nonce++;
            this.hash = this.computeHash()
        }
    }

}

export default Block;