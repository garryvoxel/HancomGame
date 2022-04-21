module.exports = (sequelize, DataTypes) => {
    const Channel = sequelize.define('Channel',
        {
            idx: {
                type: DataTypes.BIGINT.UNSIGNED,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            game_code: {
                type: DataTypes.INTEGER.UNSIGNED,
                unique: true
            },
            channel_name: {
                type: DataTypes.STRING
            },
            channel_dns: {
                type: DataTypes.STRING
            },
            current_count: {
                type: DataTypes.INTEGER.UNSIGNED
            },
            max_count: {
                type: DataTypes.INTEGER.UNSIGNED
            }
        }, {
            tableName: 'TbChannel',
            timestamps: false,
            updatedAt: false,
            createdAt: false
        }
    )

    return Channel
}