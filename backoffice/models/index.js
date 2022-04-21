'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/sequelize.json');
const db = {};
const sequelizes = {};
const files = {
     'manager.js': { database: 'BackOfficeDB' }
    ,'favorlink.js': { database: 'BackOfficeDB' }
    ,'forum.js': { database: 'WebDB' }
    ,'forumreports.js': { database: 'WebDB' }
    ,'forumcomments.js': { database: 'WebDB' }
    ,'forumlikes.js': { database: 'WebDB' }
    ,'news.js': { database: 'WebDB' }
    ,'news_images.js': { database: 'WebDB' }
    ,'events.js': { database: 'WebDB' }
    ,'log.js': { database: 'LogDB' }
    ,'users.js': { database: 'AccountDB' }
    ,'schools.js': { database: 'WebDB' }
    ,'userschools.js': { database: 'WebDB' }
    ,'friendships.js': { database: 'WebDB' }
    ,'clan.js': { database: 'WebDB' }
    ,'clanmember.js': { database: 'WebDB' }
    ,'ad.js': { database: 'WebDB' }
    ,'slang.js': { database: 'WebDB' }
    ,'slang_temp.js': { database: 'WebDB' }
    ,'faqs.js': { database: 'WebDB' }
    ,'pointlogs.js': { database: 'WebDB' }
    ,'word.js': { database: 'WordDB' }
    ,'word_category.js': { database: 'WordDB' }
    ,'accusation.js': { database: 'WebDB' }
    ,'forum_clan.js': { database: 'WebDB' }
    ,'forumc_comment.js': { database: 'WebDB' }
};

for (var key in config.databases) {
    const database = config.databases[key][env];
    sequelizes[key] = new Sequelize(database.database, null, null, database);
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const database = files[file].database;
        const model = sequelizes[database]['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelizes = sequelizes;
db.Sequelize = Sequelize;

module.exports = db;
