import { Router } from 'express';
import { param, body, validationResult } from 'express-validator';
import Transaction from "../model/transaction.mjs";

import pool from "../model/transactionPool.mjs";

var router = Router();

/* GET Transaction */
router.get('/', function (req, res, next) {
  res.send(pool.getAll());
});

/* POST add trx to pool */
router.post('/',
  body("sender").isString(),
  body("receiver").isString(),
  body("amount").isNumeric({ no_symbols: false }).toInt(),
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    var trx = new Transaction(req.body.sender, req.body.receiver, req.body.amount);
    pool.add(trx);
    res.send(trx);
  })

export default router;
