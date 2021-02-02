const {sequelize} = require('../index');
const DataTypes = require('sequelize');
const {UserSummonerIds} = require("./User_SummonerIds");
const {SummonerIds} = require("./SummonerIds");
const {CoopInfo} = require("./CoopInfo");

const User = sequelize.define('User',
    {
        email: {
            type: DataTypes.STRING,
            field: 'email'
        }
    },
    {
        timestamps: true,
        updatedAt: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'users'
    });

// User can have many accounts
User.belongsToMany(SummonerIds, {
    through: UserSummonerIds,
    foreignKey: 'user_id',
    otherKey: 'summoner_id'
});
SummonerIds.belongsToMany(User, {
    through: UserSummonerIds,
    foreignKey: 'summoner_id',
    otherKey: 'user_id'
});

// To protect data if someone use your summoner
User.hasMany(CoopInfo, {
    foreignKey: 'user_id'
});
CoopInfo.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports.User = User;
