const {sequelize} = require('../index');
const DataTypes = require('sequelize');

const Summoner = sequelize.define('Summoner',
    {
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        profileIconId: {
            type: DataTypes.INTEGER,
            field: 'profile_icon_id'
        },
        level: {
            type: DataTypes.BIGINT,
            field: 'level'
        },
        revisionDate: {
            type: DataTypes.BIGINT,
            field: 'revision_date'
        }
    },
    {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    tableName: 'summoners'
});


module.exports.Summoner = Summoner;
