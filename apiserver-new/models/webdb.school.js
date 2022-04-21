module.exports = (sequelize, DataTypes) => {
    const School = sequelize.define('School',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            region: {
                type: DataTypes.STRING
            },
            name: {
                type: DataTypes.STRING
            },
            address: {
                type: DataTypes.STRING
            },
            website: {
                type: DataTypes.STRING
            },
            created_at: {
                type: DataTypes.DATE
            }
        },
        {
            tableName: 'Schools',
            timestamps: true,
            updatedAt: false,
            createdAt: 'created_at'
        }
    )

    return School
}