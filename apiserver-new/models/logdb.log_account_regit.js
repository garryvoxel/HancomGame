const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes)=>{
    const Log_account_regit = sequelize.define('Log_account_regit',{
        idx:{
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        uuid:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        nickname:{
            type: DataTypes.STRING,
            allowNull: false
        },
        school_id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        secession:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        secession_date:{
            type: DataTypes.DATE
        },
        regit_date:{
            type: DataTypes.DATE
        }

    },{
        tableName: 'log_login',
        paranoid: true,
        timestamps: true,
        secession_date: 'secession_date',
        regit_date: 'regit_date'
    })

    return Log_account_regit
}