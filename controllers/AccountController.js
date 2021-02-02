const express = require('express');
const pino = require('pino');
const dest = pino.destination({sync: false});
const logger = pino(dest);
const asyncMiddleware = require('../utils/asyncMiddleware');
const authJwt = require('../utils/authJwt');
const {getVerificationCode} = require("../services/AccountService");
const {verifySummoner} = require("../services/AccountService");
const {getUserSummoners} = require("../services/AccountService");
const {addSummonerToUser} = require("../services/AccountService");

const router = express.Router();

router
    .post('/summoners', authJwt, asyncMiddleware(async (req, res) => {
        const summonerId = req.body.summonerId;
        const json = await addSummonerToUser(req.user, summonerId);
        res.status(json.status).send(json.body);
    }))
    .get('/summoners', authJwt, asyncMiddleware(async (req, res) => {
        const json = await getUserSummoners(req.user.id);
        res.status(json.status).send(json.body);
    }))
    .get('/verificationCode', authJwt, asyncMiddleware(async (req, res) => {
        const json = await getVerificationCode(req.user);
        res.status(json.status).send(json.body)
    }));

module.exports = router;
