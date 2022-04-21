module.exports = (sequelize, DataTypes) => {
    const Faqs = sequelize.define('Faqs',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false
            },
            question: {
                type: DataTypes.STRING,
                allowNull: false
            },
            answer: {
                type: DataTypes.STRING,
                allowNull: false
            },
            author_id: {
                type: DataTypes.BIGINT
            },
            updated_at: {
                type: DataTypes.DATE
            },
            created_at: {
                type: DataTypes.DATE
            }
        },
        {
            tableName: 'Faqs',
            timestamps: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at'
        }
    )

    return Faqs
}