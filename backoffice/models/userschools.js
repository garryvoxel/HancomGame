module.exports = (sequelize, DataTypes) => {
    const UserSchool = sequelize.define('UserSchool',
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                unique: true
            },
            school_id: {
                type: DataTypes.INTEGER
            },
            year: {
                type: DataTypes.INTEGER
            },
            classroom: {
                type: DataTypes.STRING
            },
            updated_at: {
                type: DataTypes.DATE
            },
            created_at: {
                type: DataTypes.DATE
            }
        },
        {
            tableName: 'UserSchools',
            timestamps: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at'
        }
    )

    UserSchool.associate = (models) => {
        UserSchool.belongsTo(models.School, { as: 'school' })
    }

    return UserSchool
}