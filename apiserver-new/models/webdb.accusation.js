module.exports = (sequelize, DataTypes)=>{
    const Accusation = sequelize.define('Accusation',{

        idx:{
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        accustaion_type:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        type:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        target_id:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        target_uuid:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        target_nickname:{
            type: DataTypes.STRING,
            allowNull: false
         
        },
        from_uuid:{
            type: DataTypes.BIGINT,
            allowNull: false
   
        },
        from_nickname:{
            type: DataTypes.STRING,
            allowNull: false
  
        },
        desc:{
            type: DataTypes.STRING,
            allowNull: false
          
        },
        is_complete:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        updated_at:{
            type: DataTypes.DATE,
            allowNull: true
        },
        created_at:{
            type: DataTypes.DATE
        }


    },{
        tableName: 'Accusation',
        paranoid: true,
        timestamps: true,
        updated_at: 'updated_at',
        created_at: 'created_at'

    }

    )

    return Accusation

}