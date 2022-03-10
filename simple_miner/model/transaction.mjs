import { createHash } from "crypto";

class Transaction {
    /**
     * 
     * @param {String} sender 
     * @param {String} receiver 
     * @param {Number} amount 
     * @param {String} signature
     */
    constructor(sender, receiver, amount, signature = "asd23wea", createdAt = Date.now()) {
        this.sender = sender;
        this.receiver = receiver;
        this.amount = amount;
        this.signature = signature;
        this.createdAt = createdAt;

        this.hash = this.computeHash();
    }

    static fromObject({ sender, receiver, amount, signature, createdAt }) {
        return new Transaction(sender, receiver, amount, signature, createdAt);
    }

    computeHash() { // Compute this Block's hash
        let strTrx = this.createdAt + this.sender + this.receiver + this.amount + this.signature; // Stringify the block's data
        return createHash("sha256").update(strTrx).digest("hex") // Hash said string with SHA256 encrpytion
    }
}


export default Transaction;