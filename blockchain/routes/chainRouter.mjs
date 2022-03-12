import { Router } from 'express';
import axios from 'axios'
import { param, body, check, validationResult } from 'express-validator';
import chain from "../model/blockchain.mjs";
import Block from "../model/block.mjs";

const TRXPOOL_BASE_URL = process.env.NODE_ENV === "production" ? "trxpool" : "127.0.0.1";
console.log("TRXPOOL: ", TRXPOOL_BASE_URL);

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
router.post('/blocks',
  body('nonce').isNumeric().toInt(),
  body('timestamp').isNumeric().toInt(),
  body('prevHash').isString(),
  body('minedBy').isString(),
  check('trxs.*.sender').isString(),
  check('trxs.*.receiver').isString(),
  check('trxs.*.signature').isString(),
  check('trxs.*.amount').isNumeric().toInt(),
  function (req, res, next) {
    console.log(`Blockchain - 📬 Received Block from Miner #${req?.body?.minedBy}`)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(`Blockchain - 🛑 Validation of Block from Miner #${req?.body?.minedBy} failed`)
      return res.status(400).json({ errors: errors.array() });
    }

    let { trxs, nonce, timestamp, prevHash, minedBy } = req.body;

    let block = new Block(trxs, nonce, timestamp, prevHash, minedBy);
    block.validate(chain.obtainLatestBlock().hash, chain.getTarget())

    chain.addNewBlock(block);
    console.log(`Blockchain - 💸 Block from Miner #${req?.body?.minedBy} was added to chain`);

    Promise.all(trxs.map(trx => {
      axios.delete(`http://${TRXPOOL_BASE_URL}:3001/trxpool/${trx.hash}`).catch(console.log)
    }))
      .then(() => res.send(block))
      .catch(console.log);
  })


export default router;
