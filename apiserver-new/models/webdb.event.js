module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            status: {
                type: DataTypes.STRING,
                allowNull: false
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: DataTypes.STRING
            },
            start_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            end_at: {
                type: DataTypes.DATE
            },
            image_uri: {
                type: DataTypes.STRING
            },
            creator_id: {
                type: DataTypes.BIGINT
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'Events',
            timestamps: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at'
        }
    )

    return Event
}