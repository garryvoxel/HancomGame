module.exports = (sequelize, DataTypes) => {
    const Friendship = sequelize.define('Friendship',
        {
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
            },
            friend_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            state: {
                type: DataTypes.STRING
            },
            updated_at: {
                type: DataTypes.DATE
            }
        }, {
            tableName: 'Friendships',
            timestamps: true,
            updatedAt: 'updated_at',
            createdAt: false
        }
    )

    return Friendship
}