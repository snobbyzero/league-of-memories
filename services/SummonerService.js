const {findOne, findAll, create, update} = require("../utils/dbFunctions");
const {Rank} = require("../db/models/Rank");
const {Tier} = require("../db/models/Tier");
const {QueueType} = require("../db/models/QueueType");
const {Queue} = require("../db/models/Queue");
const {SummonerIds} = require("../db/models/SummonerIds");
const Sequelize = require("sequelize/lib/sequelize");
const {Summoner} = require("../db/models/Summoner");
const pino = require('pino');
const {getSummonerFromRiot, getQueueRanksFromRiot} = require("./riotAPI");
const dest = pino.destination({sync: false});
const logger = pino(dest);

const getAndSaveInfo = async (summonerName) => {
    let result = {status: 200};
    const summonerInfoRes = await createOrUpdateSummoner(summonerName, result);
    if (!summonerInfoRes.status) {
        result.body = summonerInfoRes;
        const queueRankRes = await createOrUpdateQueueRanks(summonerInfoRes, result);
        if (queueRankRes.status) {
            return queueRankRes;
        } else {
            result.body.Queues = queueRankRes;
        }
    } else {
        return summonerInfoRes;
    }
    return result;
}
module.exports.getAndSaveInfo = getAndSaveInfo;

module.exports.getInfo = async (summonerName) => {
    const res = await findOne(SummonerIds,
        {
            '$Summoner.name$': {
                [Sequelize.Op.iLike]: summonerName
            }
        }, [
            {model: Summoner},
            {
                model: Queue,
                required: false,
                include:
                    [
                        {model: QueueType},
                        {model: Rank},
                        {model: Tier}
                    ]
            }
        ]);
    if (!res) {
        return await getAndSaveInfo(summonerName);
    }
    return res;
}

module.exports.getSummonersLike = async (summonerName) => {
    // Make sure that summoner with exactly this name in db
    const res = await getAndSaveInfo(summonerName);
    if (![200, 404].includes(res.status)) {
        return res;
    }
    const summoners = await findAll(SummonerIds,
    {
        '$Summoner.name$': {
        [Sequelize.Op.iLike]: `${summonerName}%`
    }
    }, [
        {model: Summoner},
        {
            model: Queue,
            required: false,
            include:
                [
                    {model: QueueType},
                    {model: Rank},
                    {model: Tier}
                ]
        }
    ]);
    return {
        status: 200,
        body: summoners
    };
}

const createOrUpdateSummoner = async (summonerName) => {
    const summonerResponse = await getSummonerFromRiot(summonerName);
    const summonerInfo = summonerResponse.body;
    if (summonerResponse.status === 200) {
        const savedSummoner = await findOne(SummonerIds, {summoner_id: summonerInfo.id}, [{model: Summoner}]);
        if (savedSummoner) {
            if (savedSummoner.Summoner.revisionDate !== summonerInfo.revisionDate.toString()) {
                return await updateSummoner(summonerInfo);
            } else {
                return savedSummoner;
            }
        } else {
            return await createSummoner(summonerInfo);
        }
    } else {
        return summonerResponse;
    }
}

const createOrUpdateQueueRanks = async (summonerInfo) => {
    const queueRanks = await getQueueRanksFromRiot(summonerInfo.summonerId);
    if (queueRanks.status === 200) {
        const savedQueueRanks = await findAll(
            Queue,
            {summoner_id: summonerInfo.summonerId},
            [
                {model: QueueType},
                {model: Rank},
                {model: Tier}
            ]);
        if (savedQueueRanks.length !== 0) {
            return await updateQueueRanks(savedQueueRanks, queueRanks.body);
        } else {
            return await createQueueRanks(queueRanks.body);
        }
    } else {
        return queueRanks;
    }
}

// Save summoner ids + summoner info
const createSummoner = async (json) => {
    const item = {
        accountId: json.accountId,
        summonerId: json.id,
        puuid: json.puuid,
        Summoner: {
            name: json.name.trim(),
            profileIconId: json.profileIconId,
            level: json.summonerLevel,
            revisionDate: json.revisionDate
        }
    }
    const res = await create(SummonerIds, item, [{model: Summoner}]);
    return res;
}

const updateSummoner = async (json) => {
    const item = {
        name: json.name.trim(),
        profileIconId: json.profileIconId,
        level: json.summonerLevel,
        revisionDate: json.revisionDate
    }
    const summonerInfo = await update(Summoner, item, [], {summoner_id: json.id});
    return {
        accountId: json.accountId,
        summonerId: json.id,
        puuid: json.puuid,
        Summoner: summonerInfo
    };
}

const createQueueRanks = async (items) => {
    const savedItems = [];
    await Promise.all(items.map(async (element) => {
        let queueType = await findOrCreateRankInfo(QueueType, element.queueType);
        let tier = await findOrCreateRankInfo(Tier, element.tier);
        let rank = await findOrCreateRankInfo(Rank, element.rank);
        const item = {
            leaguePoints: element.leaguePoints,
            wins: element.wins,
            losses: element.losses,
            summoner_id: element.summonerId,
            rank_id: rank.id,
            queue_type_id: queueType.id,
            tier_id: tier.id
        }
        const res = await create(Queue, item, [{model: QueueType}, {model: Rank}, {model: Tier}]);
        // Shitty code because of sequelize
        res['QueueType'] = queueType;
        res['Rank'] = rank;
        res['Tier'] = tier;
        delete res['queue_type_id'];
        delete res['rank_id'];
        delete res['tier_id'];
        savedItems.push(res);
    }));
    return savedItems;
}

const updateQueueRanks = async (prevQueueRanks, items) => {
    let res;
    const savedItems = [];
    await Promise.all(items.map(async (element) => {
        // Find out which ranks already in db
        const savedQueueRank = prevQueueRanks.filter(it => it != null && element.queueType === it.QueueType.name)[0];
        let queueType = await findOrCreateRankInfo(QueueType, element.queueType);
        let tier = await findOrCreateRankInfo(Tier, element.tier);
        let rank = await findOrCreateRankInfo(Rank, element.rank);
        const item = {
            id: savedQueueRank.id,
            leaguePoints: element.leaguePoints,
            wins: element.wins,
            losses: element.losses,
            queue_type_id: queueType.id,
            tier_id: tier.id,
            rank_id: rank.id,
            summoner_id: element.summonerId
        }
        if (savedQueueRank) {
            res = await update(Queue, item,
                [
                    {model: QueueType},
                    {model: Tier},
                    {model: Rank}
                ],
                {id: savedQueueRank.id});
        } else {
            res = await create(Queue, item,
                [
                    {model: QueueType},
                    {model: Tier},
                    {model: Rank}
                ]);
        }
        savedItems.push(res);
    }));
    return savedItems;
}

const findOrCreateRankInfo = async (model, name) => {
    const res = await findOne(model, {name: name});
    if (!res) {
        return await create(model, {name: name});
    }
    return res;
}


