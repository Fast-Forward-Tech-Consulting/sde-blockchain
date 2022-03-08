import { createHash } from "crypto";

class Transcation {
    /**
     * 
     * @param {String} sender 
     * @param {String} receiver 
     * @param {Number} amount 
     * @param {String} signature
     */
    constructor(sender, receiver, amount, signature) {
        this.createdAt = Date.now();
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.signature = signature;

        this.hash = this.computeHash();
    }

    computeHash() { // Compute this Block's hash
        let strTrx = this.createdAt + this.sender + this.receiver + this.amount + this.signature; // Stringify the block's data
        return createHash("sha256").update(strTrx).digest("hex") // Hash said string with SHA256 encrpytion
    }
}


export default Transcation;