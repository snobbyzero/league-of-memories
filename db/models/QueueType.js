const {sequelize} = require('../index');
const DataTypes = require('sequelize');
const {Queue} = require("./Queue");

// e.g RANKED_SOLO_5x5
const QueueType = sequelize.define('QueueType',
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
        tableName: 'queue_types'
    });

// Each Queue has one of static queue types
QueueType.hasMany(Queue, {
    foreignKey: 'queue_type_id'
});
Queue.belongsTo(QueueType, {
    foreignKey: 'queue_type_id'
});

module.exports.QueueType = QueueType;
