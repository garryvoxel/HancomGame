module.exports = (sequelize, DataTypes) => {
    const ForumC_Comment = sequelize.define('ForumC_Comment',
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
            reports: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },             
            report_type: {
                type: DataTypes.STRING
            },
            is_managed: {
                type: DataTypes.STRING,
                allowNull: true
            },
            managed_at: {
                type: DataTypes.DATE,
                allowNull: true
            },            
            created_at: {
                type: DataTypes.DATE
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true
            }
        }, {
            tableName: 'ForumC_Comment',
            //paranoid: true, 2019-06-20 삭제된 글도 보이기 위해서 paranoid 끔.
            paranoid: false,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: false
        }
    )

    ForumC_Comment.associate = (models) => {
        ForumC_Comment.hasMany(models.ForumC_Comment, { as: 'children', foreignKey: 'parent_id' })
        ForumC_Comment.belongsTo(models.ForumC_Comment, { as: 'parent', foreignKey: 'parent_id' })
    }

    return ForumC_Comment
}