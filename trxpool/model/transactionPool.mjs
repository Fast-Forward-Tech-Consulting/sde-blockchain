/**
 * Pool of transaction that wait to be included in the next block
 */
class TransactionPool {
    #pool = [];

    constructor() {
    }

    /**
     * Add a transaction to the pool
     * @param {*} trxToBeAdded Transaction to be added
     */
    add(trxToBeAdded) {
        if (this.#pool.some(trx => trx.hash === trxToBeAdded.hash)) {
            throw new Error(`Transaction ${trxToBeAdded.hash} already in pool`);
        }

        this.#pool.push(trxToBeAdded);
    }

    removeByHash(hash) {
        if (!this.#pool.some(trx => trx.hash === hash)) {
            throw new Error(`Trx ${hash} is not in pool and cannot be removed`);
        }

        this.#pool = this.#pool.filter(trx => trx.hash !== hash);
    }

    /**
     * 
     * @returns shallow copy of transcation pool
     */
    getAll() {
        return [... this.#pool];
    }
}

let pool = new TransactionPool();

export default pool;