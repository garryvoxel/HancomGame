const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const News = sequelize.define('News', {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        subject: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        author_id: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        views: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        likes: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        order: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_private: {
            type: Sequelize.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        temp_article_id:{
            type: Sequelize.STRING
        }
    }, {
        timestamps: true,
        paranoid: false,
        getterMethods: {
            createdDate() {
                return moment(this.created_at).format('YYYY/MM/DD');
            }
        }
    });

    return News;
};