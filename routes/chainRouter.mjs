import { Router } from 'express';
import { param, body, validationResult } from 'express-validator';
import chain from "../model/blockchain.mjs";
import Block from "../model/block.mjs";

import trxpool from "../model/transactionPool.mjs";

var router = Router();

/* GET Blocks */
router.get('/', function (req, res, next) {
  res.send(chain.getAllBlocks());
});

/* GET Block */
router.get('/blocks/:index',
  param('index').isNumeric().toInt(),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    res.send(chain.getBlockByIndex(req.params.index));
  });

/* POST add block */
router.post('/newBlock',
  function (req, res, next) {

    var trxs = trxpool.getAll();

    var block = new Block(trxs, chain.obtainLatestBlock().hash);
    chain.addNewBlock(block);

    console.log(trxs);

    for (const trx of Object.values(trxs)) {
      console.log(trx);
      trxpool.remove(trx);
    }

    res.send(block);
  })


export default router;
