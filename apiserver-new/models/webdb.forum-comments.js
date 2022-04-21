module.exports = (sequelize, DataTypes) => {
    const ForumComment = sequelize.define('ForumComment',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            post_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            parent_id: {
                type: DataTypes.BIGINT
            },
            comment: {
                type: DataTypes.STRING,
                allowNull: false
            },
            author_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            report_type: {
                type: DataTypes.STRING
            },
            created_at: {
                type: DataTypes.DATE
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true
            },
            is_dell: {
                type: DataTypes.INTEGER
            }
        }, {
            tableName: 'ForumComments',
            paranoid: false,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false
        }
    )

    ForumComment.associate = (models) => {
        ForumComment.hasMany(models.ForumComment, { as: 'children', foreignKey: 'parent_id' })
        ForumComment.belongsTo(models.ForumComment, { as: 'parent', foreignKey: 'parent_id' })
    }

    return ForumComment
}