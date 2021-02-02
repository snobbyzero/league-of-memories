const {sequelize} = require('../index');
const DataTypes = require('sequelize');
const {Summoner} = require("./Summoner");
const {Queue} = require("./Queue");
const {CoopInfo} = require("./CoopInfo");

SummonerIds = sequelize.define('SummonerIds',
    {
        summonerId: {
            type: DataTypes.STRING,
            primaryKey: true,
            field: 'summoner_id'
        },
        accountId: {
            type: DataTypes.STRING,
            field: 'account_id'
        },
        puuid: {
            type: DataTypes.STRING,
            field: 'puuid'
        }
    },
    {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'summoner_ids'
});

// Each account have only one summoner information
SummonerIds.hasOne(Summoner, {
    foreignKey: 'summoner_id'
});

// Each account have several queue ranks
SummonerIds.hasMany(Queue, {
    foreignKey: 'summoner_id'
});

// Each account have coop games with others
SummonerIds.hasMany(CoopInfo, {
    foreignKey: 'summoner_id'
});
CoopInfo.belongsTo(SummonerIds, {
    foreignKey: 'summoner_id'
})

// Other player's summoner id
SummonerIds.hasMany(CoopInfo, {
    foreignKey: 'other_id'
});
CoopInfo.belongsTo(SummonerIds, {
    foreignKey: 'other_id'
})

module.exports.SummonerIds = SummonerIds;
