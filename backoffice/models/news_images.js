const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const News = sequelize.define('NewsImages', {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        temp_article_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        image_url: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        paranoid: false,
        getterMethods: {
            createdDate() {
                return moment(this.created_at).format('YYYY/MM/DD');
            }
        }
    });

    return News;
};