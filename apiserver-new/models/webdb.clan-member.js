module.exports = (sequelize, DataTypes) => {
    const ClanMember = sequelize.define('ClanMember', {
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true
        },
        clan_id: {
            type: DataTypes.INTEGER,
			allowNull: false
        },
        is_manager: {
            type: DataTypes.BOOLEAN,
            allowNull: false
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