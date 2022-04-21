module.exports = (sequelize, DataTypes)=>{

    const Log_advertisement = sequelize.define('Log_advertisement', {

        idx:{
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        id:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        uuid:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        nickname:{
            type: DataTypes.STRING,
            allowNull: false
        },
        adversting_type:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        check_type:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        updated_at:{
            type: DataTypes.DATE
        },
        created_at:{
            type: DataTypes.DATE
        }
    },{
        tableName: 'log_advertisement',
        paranoid: false,
        timestamps: true,
        updated_at: 'updated_at',
        created_at: 'created_at'
    })
    
    return Log_advertisement
     
}