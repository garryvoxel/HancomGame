const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes)=>{
    const Log_login = sequelize.define('Log_login',{

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
        os:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        browser:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2
        },
        account_regit_date:{
            type: DataTypes.DATE
        },
        regit_date:{
            type: DataTypes.DATE
        }

    },{
        tableName: 'log_login',
        paranoid: true,
        timestamps: true,
        account_regit_date: 'account_regit_date',
        regit_date: 'regit_date'
    })
    return Log_login
}