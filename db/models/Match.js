const {sequelize} = require('../index');
const DataTypes = require('sequelize');

Match = sequelize.define('Match',
    {
        match_id: {
            type: DataTypes.BIGINT,
            field: 'match_id'
        },
        players_ids: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            field: 'players_ids'
        },
        data: {
            type: DataTypes.JSON,
            field: 'json'
        }
    },
    {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'matches'
    });

module.exports.Match = Match;
