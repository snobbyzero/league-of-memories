const express = require('express');
const {getAndSaveInfo, getInfo} = require("../services/SummonerService");
const pino = require('pino');
const dest = pino.destination({ sync: false });
const logger = pino(dest);
const asyncMiddleware = require('../utils/asyncMiddleware');
const {getSummonersLike} = require("../services/SummonerService");

const router = express.Router();

router
    .get('/:summonerName', asyncMiddleware(async (req, res, next) => {
    const summonerName = req.params.summonerName;
    const json = await getInfo(summonerName);
    logger.info(json);
    res.status(200).send(json);
}))
    .post('/:summonerName', asyncMiddleware(async (req, res, next) => {
    const summonerName = req.params.summonerName;
    const json = await getAndSaveInfo(summonerName);
    res.status(json.status).send(json.body);
}))
    .get('/list/:summonerName', asyncMiddleware(async (req, res) => {
        const summonerName = req.params.summonerName;
        const json = await getSummonersLike(summonerName);
        res.status(json.status).send(json.body);
    }));

module.exports = router;
