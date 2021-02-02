const express = require('express');
const pino = require('pino');
const dest = pino.destination({ sync: false });
const logger = pino(dest);
const asyncMiddleware = require('../utils/asyncMiddleware');
const {getAllCoopInfo} = require("../services/MatchesService");
const authJwt = require("../utils/authJwt");
const router = express.Router();

router.get('/current/:summonerId', authJwt, asyncMiddleware(async (req, res) => {
    const summonerId = req.params.summonerId;
    const userId = req.user.id;
    const json = await getAllCoopInfo(userId, summonerId);
    res.status(json.status).send(json.body);
}));

/*
router.post('/:region/:accountId', asyncMiddleware(async (req, res, next) => {
    const accountId = req.params.accountId;
    const region = req.params.region;
    const json = await getAllMatchesIds(accountId, region);
    res.status(json.status).send(json.body);
}));

 */


module.exports = router;
