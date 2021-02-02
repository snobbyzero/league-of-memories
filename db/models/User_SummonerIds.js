const {sequelize} = require('../index');
const DataTypes = require('sequelize');

const UserSummonerIds = sequelize.define('UserSummonerIds',
    {
    },
    {
        timestamps: true,
        updatedAt: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'user_summonerids'
    });

module.exports.UserSummonerIds = UserSummonerIds;
