module.exports = (sequelize, DataTypes) => {
    const ClanMembers = sequelize.define('ClanMembers',
        {
            idx: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            user_id:{
                type: DataTypes.BIGINT,
                allowNull: false
            },
            clan_id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            nickname:{
                type: DataTypes.STRING,
                allowNull: false
            },
            avatar:{
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            is_manager:{
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            is_member:{
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            is_dell:{
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            created_at:{
                type: DataTypes.DATE
            }
        },
        {
            tableName: 'ClanMembers',
            timestamps: true,
            created_at: 'created_at'
        }
    )

    return ClanMembers
}