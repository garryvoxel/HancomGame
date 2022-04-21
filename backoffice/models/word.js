const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const TbWord = sequelize.define('TbWord', {
        Idx: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        CategoryIdx: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Reference: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        GameCode: {
            type: DataTypes.INTEGER,
            allowNull: false
        },        
        FileName: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        Words: {
            type: DataTypes.TEXT,
            allowNull: false
        }        
    }, {
        tableName: 'TbWord',
        timestamps: false,
        paranoid: false,
        freezeTableName: true
    });

    return TbWord;
};

