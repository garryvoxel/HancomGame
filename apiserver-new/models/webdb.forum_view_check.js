module.exports = (sequelize, DataTypes) => {
const ViewCheck = sequelize.define('ForumViewCheck',
    {
        idx : {
            type : DataTypes.BIGINT,
            allowNull: false,
            primaryKey : true,
            auctoIncrement : true
        },
        uuid : {
            type : DataTypes.BIGINT,
            allowNull: false
        },
        post_id : {
            type : DataTypes.INTEGER,
            allowNull: false
        },
        is_clan : {
            type : DataTypes.INTEGER,
            allowNull:false
        },
        regit_date : {
            type : DataTypes.DATE,
            allowNull:false
        }
    },
    {
        tableName: 'ForumViewCheck',
        timestamps: true,
        regit_date: 'regit_date'
    }
)

return ViewCheck;
}