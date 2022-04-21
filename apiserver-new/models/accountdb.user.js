const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User',
        {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true
            },
            session_id: {
                type: DataTypes.STRING
            },
            nickname: {
                type: DataTypes.STRING,
                unique: true
            },
            points: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            schoold_id : {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            school_name: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'empty'
            },
            avatar: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            language: {
                type: DataTypes.STRING
            },
            timezone: {
                type: DataTypes.STRING
            },
            country: {
                type: DataTypes.STRING
            },
            target_typing_speed: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 150
            },
            target_typing_accuracy: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 95
            },
            secession:{
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            restricted: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            tableName: 'Users',
            timestamps: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at'
        }
    )

    return User
}
