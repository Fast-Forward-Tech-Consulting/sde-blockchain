import { Router } from 'express';
import { param, body, validationResult } from 'express-validator';
import chain from "../model/blockchain.mjs";

var router = Router();

/* GET Hash Target */
router.get('/', function (req, res, next) {
    res.send({ target: chain.getTarget() });
});

export default router;
