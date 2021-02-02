const Sequelize = require('sequelize/lib/sequelize');
const fs = require('fs');
const path = require("path");
const conf = require('./config')["dev"];

module.exports.sequelize = new Sequelize(conf.dbname, conf.username, conf.password, {
    host: conf.hostname,
    dialect: conf.dialect
});

const models = {};

fs.readdirSync(path.join(__dirname, 'models')).forEach(file => {
    const model = require(path.join(__dirname, 'models', file));

    models[model.name] = model;
});
Object.keys(models).forEach(modelName => {
    if ("associate" in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.Sequelize = Sequelize;
module.exports.models = models;
