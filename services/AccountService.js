const {Summoner} = require("../db/models/Summoner");
const {UserSummonerIds} = require("../db/models/User_SummonerIds");
const {findOne, create} = require("../utils/dbFunctions");
const {User} = require("../db/models/User");
const {SummonerIds} = require("../db/models/SummonerIds");
const crypto = require("crypto");


module.exports.addSummonerToUser = async (u, summonerId) => {
    let user;
    user = await findOne(User, {id: u.id}, [{model: SummonerIds}]);
    if (user) {
        let exists = false;
        user.SummonerIds.forEach(s => {
            if (s.summonerId === summonerId) {
                exists = true;
            }
        });
        if (exists) {
            return {
                status: 400,
                body: 'ALREADY_ADDED'
            };
        }
    } else {
        return {
            status: 400,
            body: 'USER_NOT_FOUND'
        };
    }
    if (await verifySummoner(user, summonerId)) {
        await create(UserSummonerIds, {user_id: user.id, summoner_id: summonerId});
        return {
            status: 200,
            body: 'ADDED'
        };
    }
    return {
        status: 400,
        body: 'CHECK_CODE'
    }
};

module.exports.getUserSummoners = async (userId) => {
    const summoners = await findOne(User, {id: userId}, [{model: SummonerIds, include: Summoner}]);
    return {
        status: 200,
        body: summoners
    };
}

const verifySummoner = async (user, summonerId) => {
    const res = await verify(summonerId);
    return res.status === 200 && res.body === generateCode(user.email);

}

module.exports.getVerificationCode = async (user) => {
    if (user) {
        return {
            status: 200,
            body: generateCode(user.email)
        };
    }
    return {
        status: 400,
        body: 'USER_NOT_FOUND'
    }
}

const generateCode = (email) => {
    return crypto.createHash('sha1').update(email).digest('hex');
}
