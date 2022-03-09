import e, { Router } from 'express';
import axios from 'axios'
import { param, body, validationResult } from 'express-validator';
import chain from "../model/blockchain.mjs";
import Block from "../model/block.mjs";

import trxpool from "../model/transactionPool.mjs";
import Transaction from '../model/transaction.mjs';

var router = Router();

/* GET Blocks */
router.get('/', function (req, res, next) {
  res.send(chain.getAllBlocks());
});

/* GET Block */
router.get('/blocks/:index(\d+)',
  param('index').isNumeric().toInt(),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.send(chain.getBlockByIndex(req.params.index));
  });

router.get('/blocks/latest',
  function (req, res, next) {
    res.send(chain.obtainLatestBlock());
  });

/* POST add block */
router.post('/newBlock',
  function (req, res, next) {

    //var trxs = trxpool.getAll();
    var trxs = axios.get('http://127.0.0.1:3000/trxpool')
      .then(response => response.data.map(trx => Transaction.fromObject(trx)));

    var latestBlock = axios.get("http://127.0.0.1:3000/chain/blocks/latest")
      .then(response => response.data);

    Promise
      .all([trxs, latestBlock])
      .then(([trxs, latestBlock]) => {
        let block = new Block(trxs, latestBlock.hash);
        chain.addNewBlock(block);

        for (const trx of trxs) {
          console.log(trx);
          trxpool.remove(trx);
        };

        res.send(block);
      })
      .catch(error => console.log(error));
  })


export default router;
