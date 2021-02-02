const params = require("../riot_api_params");
const {requestAPI} = require("../utils/requestAPI");


module.exports.getCurrentGameInfo = async (summonerId) => {
    const options = {
        host: `${params.Region}${params.Host}`,
        port: params.Port,
        path: `/lol/spectator/v4/active-games/by-summoner/${summonerId}`,
        headers: {
            'Accept-Charset': params.AcceptCharset,
            'Origin': params.Origin,
            'X-Riot-Token': process.env.devToken
        },
        method: 'GET'
    };
    return await requestAPI(options);
}

module.exports.getSummonerFromRiot = async (summonerName) => {
    const options = {
        host: `${params.Region}${params.Host}`,
        port: params.Port,
        path: `/lol/summoner/v4/summoners/by-name/${summonerName}`,
        headers: {
            'Accept-Charset': params.AcceptCharset,
            'Origin': params.Origin,
            'X-Riot-Token': process.env.devToken
        },
        method: 'GET'
    };
    return await requestAPI(options);
}

module.exports.getQueueRanksFromRiot = async (summonerId) => {
    const options = {
        host: `${params.Region}${params.Host}`,
        port: params.Port,
        path: `/lol/league/v4/entries/by-summoner/${summonerId}`,
        headers: {
            'Accept-Charset': params.AcceptCharset,
            'Origin': params.Origin,
            'X-Riot-Token': process.env.devToken
        },
        method: 'GET'
    };
    return await requestAPI(options);
}

module.exports.getMatchInfo = async (matchId) => {
    const options = {
        host: `${params.Region}${params.Host}`,
        port: params.Port,
        path: `/lol/match/v4/matches/${matchId}`,
        headers: {
            'Accept-Charset': params.AcceptCharset,
            'Origin': params.Origin,
            'X-Riot-Token': process.env.DevToken
        },
        method: 'GET'
    };
    return await requestAPI(options);
}

module.exports.loadMatchesIds = async (accountId, beginIndex, endIndex) => {
    const options = {
        host: `${params.Region}${params.Host}`,
        port: params.Port,
        path: `/lol/match/v4/matchlists/by-account/${accountId}?beginIndex=${beginIndex}&endIndex=${endIndex}`,
        headers: {
            'Accept-Charset': params.AcceptCharset,
            'Origin': params.Origin,
            'X-Riot-Token': process.env.devToken
        },
        method: 'GET'
    };
    return await requestAPI(options);
}

module.exports.verify = async (summonerId) => {
    const options = {
        host: `${params.Region}${params.Host}`,
        port: params.Port,
        path: `/lol/platform/v4/third-party-code/by-summoner/${summonerId}`,
        headers: {
            'Accept-Charset': params.AcceptCharset,
            'Origin': params.Origin,
            'X-Riot-Token': process.env.devToken
        },
        method: 'GET'
    }
    return await requestAPI(options);
}
