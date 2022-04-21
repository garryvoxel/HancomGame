const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const ForumReports = sequelize.define('ForumReports', {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true
        },
        source_id: {
            type: Sequelize.BIGINT,
            allowNull: true
        },
        reporter_id: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        report_id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        reported_at: {
            type: Sequelize.DATE,
            allowNull: false
        }        
    }, {
        timestamps: false,
        paranoid: false
    });

    return ForumReports;
};