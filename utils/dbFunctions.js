const {sequelize} = require('../db/index');
const pino = require('pino');
const dest = pino.destination({sync: false});
const logger = pino(dest);

module.exports.create = async (model, item, include = []) => {
    try {
        return await sequelize.transaction(async (t) => {
            const res = await model.create(item, {include: include, transaction: t});
            return res.get({plain: true});
        });
    } catch (err) {
        logger.error(err);
        return err;
    }
}

module.exports.update = async (model, item, include, conditions) => {
    try {
        return await sequelize.transaction(async (t) => {
            const res = await model.update(item, {
                include: include,
                where: conditions,
                transaction: t,
                returning: true,
                plain: true
            });
            return res[1].get({plain: true});
        });
    } catch (err) {
        logger.error(err);
        return err;
    }
}


module.exports.findAll = async (model, conditions, include = []) => {
    return await model.findAll({
        include: include,
        where: conditions
    });
}

module.exports.findOne = async (model, conditions, include = []) => {
    const res = await model.findAll({
        include: include,
        where: conditions
    });
    return res[0];
}

module.exports.bulkCreate = async (model, items, include=[]) => {
    try {
        return await sequelize.transaction(async (t) => {
            const res = await model.bulkCreate(items, {include: include, transaction: t});
            return res;
        });
    } catch (err) {
        logger.error(err);
        return err;
    }
}

module.exports.updateArray = async (model, col, item, conditions, include=[]) => {
    try {
        return await sequelize.transaction(async (t) => {
            const res = await model.update({[col]: sequelize.fn('array_append', sequelize.col(col), item.toString())}, {
                include: include,
                where: conditions,
                transaction: t,
                returning: true
            });
            return res[1];
        });
    } catch (err) {
        console.log(err);
        return err;
    }
}
