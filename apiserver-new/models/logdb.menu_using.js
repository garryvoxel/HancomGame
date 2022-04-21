module.exports = (sequelize, DataTypes)=>{

    const Log_menu_using = sequelize.define('Log_menu_using', {

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
        menu:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        access_date:{
            type: DataTypes.DATE
        },
        updated_at:{
            type: DataTypes.DATE
        },
        created_at:{
            type: DataTypes.DATE
        }
    },{
        tableName: 'log_menu_using',
        paranoid: false,
        timestamps: true,
        access_date: 'access_date',
        updated_at: 'updated_at',
        created_at: 'created_at'
    })
    
    return Log_menu_using
     
}