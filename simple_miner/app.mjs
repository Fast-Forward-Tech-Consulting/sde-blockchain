import Block from "./model/block.mjs";
import Transaction from "./model/transaction.mjs";
import axios from "axios";

const MINER_ID = Math.floor(Math.random() * 1000).toString();

while (true) {
    // Give the blockchain some time to remove TRX from the pool
    await sleep(1000);

    var trxs = axios.get('http://127.0.0.1:3001/trxpool')
        .then(response => response.data.map(trx => Transaction.fromObject(trx)));

    var latestBlock = axios.get("http://127.0.0.1:3000/chain/blocks/latest")
        .then(response => response.data);

    var target = axios.get("http://127.0.0.1:3000/target")
        .then(response => response.data.target);

    await Promise
        .all([trxs, latestBlock, target])
        .then(async ([trxs, latestBlock, target]) => {
            console.log(`Miner #${MINER_ID} - ⛏ Start Mining with target = ${target}`)
            let block = new Block(trxs, latestBlock.hash, MINER_ID);
            block.mine(target);

            console.log(`Miner #${MINER_ID} - 💎 Found a Block ${block.hash.substring(0, 10)}... with nonce ${block.nonce}`);

            return axios.post("http://127.0.0.1:3000/chain/blocks", block);
        })
        .then(res => {
            console.log(`Miner #${MINER_ID} - 💵 Successfully sent to Blockchain`)
        })
        .catch(error => console.log(`Miner #${MINER_ID} - ☠ Error while sending to Blockchain`));
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}