import e, { Router } from 'express';
import axios from 'axios'
import { param, body, validationResult } from 'express-validator';
import Block from "../model/block.mjs";

import Transaction from '../model/transaction.mjs';

var router = Router();

/* POST add block */
router.post('/mine',
  function (req, res, next) {

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

        res.send(block);
      })
      .catch(error => console.log(error));
  })


export default router;
