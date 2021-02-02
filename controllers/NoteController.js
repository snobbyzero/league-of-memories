const express = require('express');
const pino = require('pino');
const dest = pino.destination({ sync: false });
const logger = pino(dest);
const asyncMiddleware = require('../utils/asyncMiddleware');
const authJwt = require("../utils/authJwt");
const {addNote, getNote} = require("../services/NotesService");
const router = express.Router();

router.post('/notes/', authJwt, asyncMiddleware(async (req, res) => {
    const summonerId = req.body.summonerId;
    const otherId = req.body.otherId;
    const note = req.body.note;
    const userId = req.user.id;
    const json = await addNote(userId, summonerId, otherId, note);
    res.status(json.status).send(json.body);
}))
    .get('/notes/', authJwt, asyncMiddleware(async (req, res) => {
        const userId = req.user.id;
        const summonerId = req.query.summoner_id;
        const otherId = req.query.other_id;
        const json = await getNote(userId, summonerId, otherId);
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
