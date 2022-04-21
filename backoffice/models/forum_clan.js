const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const ForumClan = sequelize.define('ForumClan', {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        clan_id: {
            type: Sequelize.INTEGER,
            allowNull: false
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
        reports: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },        
        order: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_managed: {
            type: Sequelize.STRING,
            allowNull: true
        },
        managed_at: {
            type: Sequelize.DATE,
            allowNull: true
        },
        deleted_at: {
            type: Sequelize.DATE,
            allowNull: true
        },
        comments_count: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }                
    }, {
        tableName: 'ForumClan',
        timestamps: true,
        //paranoid: true,  2019-06-20 삭제된 글도 보이기 위해서 paranoid 끔.
        paranoid: false,
        getterMethods: {
            createdDate() {
                return moment(this.created_at).format('YYYY/MM/DD');
            }
        }
    });

    return ForumClan;
};