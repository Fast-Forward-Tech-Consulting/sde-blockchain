import Block from "./model/block.mjs";
import Transaction from "./model/transaction.mjs";
import axios from "axios";

while (true) {
    await sleep(2000);

    var trxs = axios.get('http://127.0.0.1:3001/trxpool')
        .then(response => response.data.map(trx => Transaction.fromObject(trx)));

    var latestBlock = axios.get("http://127.0.0.1:3000/chain/blocks/latest")
        .then(response => response.data);

    var target = axios.get("http://127.0.0.1:3000/target")
        .then(response => response.data.target);

    Promise
        .all([trxs, latestBlock, target])
        .then(async ([trxs, latestBlock, target]) => {
            let block = new Block(trxs, latestBlock.hash);

            block.mine(target);

            return block;
        })
        .then(block => {
            console.log(`Miner - Found a Block with nonce ${block.nonce}`, block);
        })
        .catch(error => console.log(error));
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}