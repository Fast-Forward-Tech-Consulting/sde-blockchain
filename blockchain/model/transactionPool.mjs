/**
 * Pool of transaction that wait to be included in the next block
 */
class TransactionPool {
    #pool = [];

    constructor() {
    }

    /**
     * Add a transaction to the pool
     * @param {*} trx Transaction to be added
     */
    add(trx) {
        if (this.#pool.includes(trx)) {
            throw new Error(`Transaction ${trx.hash} already in pool`);
        }

        this.#pool.push(trx);
    }

    /**
     * Remove a transaction from the pool
     * @param {*} trxToBeRemoved Transaction to be removed
     */
    remove(trxToBeRemoved) {
        if (!this.#pool.includes(trxToBeRemoved)) {
            throw new Error(`Trx ${trxToBeRemoved.hash} is not in pool and cannot be removed`);
        }

        this.#pool = this.#pool.filter(trx => trx !== trxToBeRemoved);
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