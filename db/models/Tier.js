const {sequelize} = require('../index');
const DataTypes = require('sequelize');
const {Queue} = require("./Queue");

// e.g. Silver, Gold, Diamond
const Tier = sequelize.define('Tier',
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
        tableName: 'tiers'
    });

// Each Queue has one of static tiers
Tier.hasMany(Queue, {
    foreignKey: 'tier_id'
});
Queue.belongsTo(Tier, {
    foreignKey: 'tier_id'
});

module.exports.Tier = Tier;
