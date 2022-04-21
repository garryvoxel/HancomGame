const Sequelize = require('sequelize');
const moment = require('moment');



module.exports = (sequelize, DataTypes) => {
    const Events = sequelize.define('Events', {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        status:{
            type: Sequelize.STRING,
            allowNull: false
        },
        subject: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        start_at: {
            type: Sequelize.DATE,
            allowNull: false
        },
        end_at: {
            type: Sequelize.DATE,
            allowNull: false
        },
        image_uri: {
            type: Sequelize.STRING,
            allowNull: false
        },
        mobile_image_uri: {
            type: Sequelize.STRING,
            allowNull: false
        },        
        creator_id: {
            type: Sequelize.BIGINT,
            allowNull: false
        }
    }, {
        timestamps: true,
        //paranoid: true,
        paranoid: false,
        getterMethods: {
            createdDate() {
                return moment(this.created_at).format('YYYY/MM/DD');
            }
        }
    });

    // Events.associate = function(models) {
    //     Events.belongsTo(models.Managers, {foreignKey:'creator_id', targetKey:'id'});
    // };

    return Events;
};