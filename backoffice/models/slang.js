const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
    const Slang = sequelize.define('Slang', {
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
        tableName: 'Slang',
        timestamps: true,
        //paranoid: true,
        paranoid: false,
        getterMethods: {
            createdDate() {
                return moment(this.created_at).format('YYYY/MM/DD');
            }
        }
    });

    return Slang;
};