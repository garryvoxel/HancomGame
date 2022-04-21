module.exports = (sequelize, DataTypes) => {
    const FavorLinks = sequelize.define('FavorLinks',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            manager_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING
            },
            link_url: {
                type: DataTypes.STRING
            },
            created_at: {
                type: DataTypes.DATE
            },
            updated_at: {
                type: DataTypes.DATE
            }                       
        }, {
            tableName: 'FavorLinks',
            timestamps: true,
            paranoid: false
        }
    )

    return FavorLinks
}