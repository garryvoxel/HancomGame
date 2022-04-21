const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const Forum = sequelize.define('Forum', {
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
        }        
    }, {
        tableName: 'Forum',
        timestamps: true,
        //paranoid: true,  2019-06-20 삭제된 글도 보이기 위해서 paranoid 끔.
        paranoid: false,
        getterMethods: {
            createdDate() {
                return moment(this.created_at).format('YYYY/MM/DD');
            }
        }
    });

    return Forum;
};