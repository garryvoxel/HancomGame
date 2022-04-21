module.exports = (sequelize, DataTypes) => {
    const PointLog = sequelize.define('PointLog',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            balance: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            created_at: {
                type: DataTypes.DATE
            }
        },
        {
            tableName: 'PointLogs',
            timestamps: true,
            updatedAt: false,
            createdAt: 'created_at'
        }
    )

    return PointLog
}