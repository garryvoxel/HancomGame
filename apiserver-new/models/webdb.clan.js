module.exports = (sequelize, DataTypes) => {
    const Clan = sequelize.define('Clan',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            creator_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            manager_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING
            },
            updated_at: {
                type: DataTypes.DATE
            },
            created_at: {
                type: DataTypes.DATE
            }
        }, {
            tableName: 'Clans',
            timestamps: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at'
        }
    )

    Clan.associate = (models) => {
        Clan.hasMany(models.ClanMember, { as: 'members' })
    }

    return Clan
}