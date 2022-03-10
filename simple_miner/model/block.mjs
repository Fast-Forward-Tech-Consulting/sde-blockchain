import { createHash } from 'crypto'; // Import NodeJS's Crypto Module

class Block { // Our Block Class
    /**
     * Create a new Block with a Transcation
     * @param {Transcation} trx 
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
        let strBlock = this.nonce + this.prevHash + this.timestamp + JSON.stringify(this.trx) // Stringify the block's data
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

        console.log(`Miner - Nonce ${this.nonce}found!`);
        /*return new Promise((resolve, reject) => {
            while(blockFound) {
                setImmediate(() => {
                    
                })
            }
        })*/
    }

}

export default Block;