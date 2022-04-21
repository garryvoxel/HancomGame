module.exports = (sequelize, DataTypes) => { 

    const ForumClan = sequelize.define('ForumClan',
    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        clan_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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
        updated_at: {
            type: DataTypes.DATE
        },
        created_at: {
            type: DataTypes.DATE
        },
        deleted_at: {
            type: DataTypes.DATE
        },
        comments_count: {
            type: DataTypes.INTEGER
        }

    },{
        tableName: 'ForumClan',
        paranoid: false,
        timestamps: true,
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        deletedAt: 'deleted_at'

    }
    )

    return ForumClan
}