module.exports = (sequelize, DataTypes) => {
    const News = sequelize.define('News',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: DataTypes.STRING,
            },
            author_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            views: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            likes: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            order: {
                type: DataTypes.INTEGER
            },
            is_private: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            updated_at: {
                type: DataTypes.DATE
            },
            created_at: {
                type: DataTypes.DATE
            },
            deleted_at: {
                type: DataTypes.DATE
            }
        }, {
            tableName: 'News',
            paranoid: true,
            timestamps: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at',
            deletedAt: 'deleted_at'
        }
    )

    return News
}