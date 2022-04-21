const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const Accusation = sequelize.define('Accusation', {
        idx: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        accusation_type: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        target_id: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        target_uuid: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        target_nickname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        from_uuid: {
            type: Sequelize.BIGINT,
            allowNull: false
        },        
        from_nickname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        desc: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'NONE'
        },
        is_complete: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'Accusation',
        timestamps: true,
        paranoid: false,
        getterMethods: {
            createdDate() {
                return moment(this.created_at).format('YYYY/MM/DD');
            }
        }
    });

    return Accusation;
};