const {create} = require("../utils/dbFunctions");
const {SummonerIds} = require("../db/models/SummonerIds");
const {CoopInfo} = require("../db/models/CoopInfo");
const {update, findOne} = require("../utils/dbFunctions");

module.exports.addNote = async (userId, summonerId, otherSummonerId, note) => {
    if (await findOne(CoopInfo, {user_id: userId, summoner_id: summonerId, other_id: otherSummonerId})) {
        return await update(CoopInfo, {note: note}, [{model: SummonerIds}], {
            user_id: userId,
            summoner_id: summonerId,
            other_id: otherSummonerId
        });
    }
    return await create(CoopInfo, {user_id: userId, summoner_id: summonerId, other_id: otherSummonerId, note: note});
}

module.exports.getNote = async (userId, summonerId, otherSummonerId) => {
    return await findOne(CoopInfo, {user_id: userId, summoner_id: summonerId, other_id: otherSummonerId});
}

