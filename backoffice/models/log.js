var Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    var Log = sequelize.define('TbLog', {
        Idx: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        LogIdx: {
            type: Sequelize.BIGINT(20),
            allowNull: false,
        },
        UUID: {
            type: Sequelize.BIGINT(20),
            allowNull: false
        },
        NickName: {
            type: Sequelize.STRING(12),
            allowNull: false
        },
        Msg0: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg1: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg2: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg3: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg4: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg5: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg6: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg7: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg8: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg9: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg10: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg11: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg12: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg13: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg14: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg15: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg16: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg17: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg18: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Msg19: {
            type: Sequelize.STRING(256),
            allowNull: true,
            defaultValue: null
        },
        Val0: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val1: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val2: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val3: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val4: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val5: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val6: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val7: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val8: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val9: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val10: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val11: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val12: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val13: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val14: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val15: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val16: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val17: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val18: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val19: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            defaultValue: 0
        },
        Val20: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val21: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val22: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val23: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val24: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val25: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val26: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val27: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val28: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val29: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val30: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val31: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val32: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val33: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val34: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val35: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val36: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val37: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val38: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Val39: {
            type: Sequelize.DOUBLE,
            allowNull: true,
            defaultValue: 0
        },
        Date0: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        Date1: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        Date2: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        Date3: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        Date4: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        Date5: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        Date6: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        Date7: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        Date8: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        Date9: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null
        },
        RegisterTime: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW
        },
    }, {
        timestamps: false,
        freezeTableName: true,  // disable the modification of table names
    });

    return Log;
};