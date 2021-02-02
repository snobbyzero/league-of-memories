const {getInfo} = require("./SummonerService");
const {CoopInfo} = require("../db/models/CoopInfo");
const {create, findOne, findAll, update, bulkCreate, updateArray} = require("../utils/dbFunctions");
const {SummonerIds} = require("../db/models/SummonerIds");
const {getCurrentGameInfo, getMatchInfo} = require("./riotAPI");


module.exports.getAllCoopInfo = async (userId, summonerId) => {
    const currentGameInfo = await getCurrentGameInfo(summonerId);
    if (currentGameInfo.status === 200) {
        const summonerIds = [];
        await Promise.all(currentGameInfo.body.participants.map(async (participant) => {
            const id = participant.summonerId;
            const summonerName = participant.summonerName;
            const res = await getInfo(summonerName);
            if (id !== summonerId) {
                summonerIds.push(id);
            }
        }));

        const coopInfoArr = await addMatch(userId, summonerId, summonerIds, currentGameInfo.body.gameId);
        return {
            status: 200,
            body: coopInfoArr
        };
    } else {
        return currentGameInfo;
    }
}

const createCoopInfo = async (userId, summonerId, otherSummonerId) => {
    const coopInfo = await create(CoopInfo, {
        user_id: userId,
        summoner_id: summonerId,
        other_id: otherSummonerId
    }, [{model: SummonerIds}]);
    return coopInfo;
}

const getCoopInfo = async (userId, summonerId, otherSummonerId) => {
    return await findOne(CoopInfo, {user_id: userId, summoner_id: summonerId, other_id: otherSummonerId})
}

const getAllSavedCoopInfo = async (userId, summonerId, otherSummonerIds) => {
    return await findAll(CoopInfo, {user_id: userId, summoner_id: summonerId, other_id: otherSummonerIds});
}

const addNote = async (userId, summonerId, otherSummonerId, note) => {
    return update(CoopInfo, {note: note}, [{model: SummonerIds}], {
        user_id: userId,
        summoner_id: summonerId,
        other_id: otherSummonerId
    })
}

// TODO error catching
const addMatch = async (userId, summonerId, otherSummonerIds, matchId) => {
    const savedCoopInfo = await getAllSavedCoopInfo(userId, summonerId, otherSummonerIds);
    const savedSummonerIds = savedCoopInfo.map(coopInfo => coopInfo.other_id);
    const notSavedSummonerIds = otherSummonerIds.filter((id) => savedSummonerIds.indexOf(id) < 0);
    const created = await bulkCreate(CoopInfo, notSavedSummonerIds.map((id) => {
        return {user_id: userId, summoner_id: summonerId, other_id: id, matches_ids: [matchId]}
    }), [{model: SummonerIds}]);
    const notUpdatedSummonerIds = savedCoopInfo.flatMap(coopInfo => {
        if (coopInfo.matches_ids.length > 0 && !coopInfo.matches_ids.includes(matchId.toString())) {
            return coopInfo.other_id;
        }
    });
    const updated = await updateArray(CoopInfo, 'matches_ids', matchId, {
        user_id: userId,
        summoner_id: summonerId,
        other_id: notUpdatedSummonerIds
    }, [{model: SummonerIds}]);
    if (updated.length > 0) {
        return created.concat(updated);
    } else {
        return created.concat(savedCoopInfo);
    }
}


/*
const getMatchesIds = async (accountId, matchesCount) => {
    const matchesIds = []
    let beginIndex = 0;
    let totalGames;
    const totalGamesReq = await loadMatchesIds(accountId, 10000, 10000);
    if (totalGamesReq.status === 200) {
        totalGames = totalGamesReq.body.totalGames;
    } else {
        return totalGamesReq;
    }
    do {
        const res = await loadMatchesIds(accountId, beginIndex, beginIndex + 100);
        if (res.status === 200) {
            const body = res.body;
            matchesIds.push.apply(matchesIds, body.matches.map(match => match.gameId));
            beginIndex += 100;
        } else {
            console.log(`Count: ${matchesIds.length}`);
            console.log(matchesIds);
            return res;
        }
    } while (beginIndex < matchesCount && beginIndex < totalGames);
    return {
        status: 200,
        body: matchesIds
    };
}

const getPlayersFromMatch = async (matchId) => {
    let matchReq = await getMatchInfo(matchId);
    if (matchReq.status === 200) {
        matchReq.body = matchReq.body.participantIdentities.map(participant => {
            return {
                summonerName: participant.player.summonerName,
                accountId: participant.player.accountId
            }
        });
    }
    return matchReq;
}

module.exports.getCoopInfo = async (accountId) => {
    let playsCount = {};
    const matchesCount = 500;
    let processedMatchesCount = 0;
    const matchIds = await getMatchesIds(accountId, matchesCount);
    if (matchIds.status === 200) {
        console.log(`Matches count: ${matchIds.body.length}`);
        for (const matchId of matchIds.body) {
            let players;
            do {
                console.log("Timeout 1.2 sec");
                await timeout(1210);
                players = await getPlayersFromMatch(matchId);
            } while (players.status === 429);
            if (players.status === 200) {
                players.body.forEach(player => {
                    if (player.accountId !== accountId) {
                        if (playsCount[player.summonerName]) {
                            playsCount[player.summonerName] += 1;
                        } else {
                            playsCount[player.summonerName] = 1;
                        }
                    }
                });
                processedMatchesCount += 1;
            } else {
                console.log(players.status);
                console.log(playsCount);
            }
            console.log(`Processed matches count: ${processedMatchesCount}`);
        }
    }
    const items = Object.keys(playsCount).map((key) => [key, playsCount[key]]);
    return {
        status: 200,
        body: items.sort((a, b) => b[1] - a[1])
    };
}

 */


