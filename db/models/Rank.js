const {sequelize} = require('../index');
const DataTypes = require('sequelize');
const {Queue} = require("./Queue");

// e.g. I, II, IV
const Rank = sequelize.define('Rank',
    {
        name: {
            type: DataTypes.STRING,
            field: 'name'
        }
    },
    {
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        tableName: 'ranks'
    });

// Each Queue has one of static ranks
Rank.hasMany(Queue, {
    foreignKey: 'rank_id',
});
Queue.belongsTo(Rank, {
    foreignKey: 'rank_id'
});

module.exports.Rank = Rank;
