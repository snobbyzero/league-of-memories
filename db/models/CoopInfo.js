const {sequelize} = require('../index');
const DataTypes = require('sequelize');

CoopInfo = sequelize.define('CoopInfo',
    {
        note: {
            type: DataTypes.TEXT,
            field: 'note'
        },
        matches_ids: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            field: 'matches_ids'
        }
    },
    {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'coop_info'
    });

module.exports.CoopInfo = CoopInfo;
