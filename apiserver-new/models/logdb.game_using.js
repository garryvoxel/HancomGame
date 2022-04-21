module.exports = (sequelize, DataTypes)=>{

    const Log_game_using = sequelize.define('Log_game_using', {

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
        os:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        browser:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        game_type:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 10000
        },
        game_value:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        difficult_lev:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        taja_check_count:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1
        },
        sentence_idx:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1
        },
        play_time:{
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        },
        is_result:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_login:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        regit_date:{
            type: DataTypes.DATE
        }
    },{
        tableName: 'log_game_using',
        paranoid: true,
        timestamps: true,
        regit_date: 'regit_date'
    })
    
    return Log_game_using
}