module.exports = (sequelize, DataTypes) => {
    const ClanMember = sequelize.define('ClanMember', {
        idx: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },        
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        clan_id: {
            type: DataTypes.INTEGER,
			allowNull: false
        },
        nickname: {
            type: DataTypes.STRING,
			allowNull: false
        },     
        avatar: {
            type: DataTypes.INTEGER,
			allowNull: false
        },           
        is_manager: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        is_member: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },        
        is_dell: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },         
        created_at: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'ClanMembers',
        timestamps: true,
        updatedAt: false,
        createdAt: 'created_at'
    })

    ClanMember.associate = function(models) {
		ClanMember.hasOne(models.Clan, { as: 'clan', foreignKey: 'id' })
    }

    return ClanMember
}