const {sequelize} = require('../index');
const DataTypes = require('sequelize');

const Queue = sequelize.define('Queue',
    {
        leaguePoints: {
            type: DataTypes.INTEGER,
            field: 'league_points'
        },
        wins: {
            type: DataTypes.INTEGER,
            field: 'wins'
        },
        losses: {
            type: DataTypes.INTEGER,
            field: 'losses'
        }
    },
    {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'queues',
        defaultScope: {
            attributes: { exclude: ['summoner_id', 'tier_id', 'rank_id', 'queue_type_id'] }
        }
    });

module.exports.Queue = Queue;
