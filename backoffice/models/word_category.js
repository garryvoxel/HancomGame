const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const TbCategory = sequelize.define('TbCategory', {
        Idx: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        CategoryName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'TbCategory',
        timestamps: false,
        paranoid: false,
        freezeTableName: true
    });

    return TbCategory;
};

