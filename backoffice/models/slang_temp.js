const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const Slang_temp = sequelize.define('Slang_temp', {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        word: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    }, {
        tableName: 'Slang_temp',
        timestamps: false,
        paranoid: false
    });

    return Slang_temp;
};