const Sequelize = require('sequelize');
const crypto = require('crypto');
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const Manager = sequelize.define('Managers', {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            set(value) {
                this.setDataValue(
                    'password', crypto.createHash('sha256').update(value).digest('base64')
                );
            }
        },
        display_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        permissions: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '000000000'
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        login_fail_count: {
            type: Sequelize.INTEGER,
            allowNull: false
        },        
        pw_updated_at:{
            type: Sequelize.DATE,
            allowNull: true
        },
        ipv4: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        }
    }, {
        timestamps: true,
        paranoid: true,
        getterMethods: {
            createdDate() {
                return moment(this.created_at).format('YYYY/MM/DD');
            },
            pwUpdatedDate() {
                return moment(this.pw_updated_at).format('YYYY/MM/DD');
            },
            diffPwUpdatedDate(){
                return moment().diff(this.pw_updated_at, 'days');
            }
        }
    });

    Manager.prototype.generateHash = function(password) {
        return crypto.createHash('sha256').update(password).digest('base64');
    };
    
    Manager.prototype.verifyPassword = function(password) {
        return this.generateHash(password) === this.password;
    };

    return Manager;
};