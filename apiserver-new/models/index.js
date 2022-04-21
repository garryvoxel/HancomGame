const
    fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    basename = path.basename(__filename),
    env = process.env.NODE_ENV || 'development',
    config = require(__dirname + '/../config/sequelize.config.json'),
    db = {},
    sequelizes = {}

console.log('Mode: ' + process.env.NODE_ENV);

for (var key in config.databases) {
    const database = config.databases[key][env]
    sequelizes[key] = new Sequelize(database.database, null, null, database)
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    })
    .forEach(file => {
        if (!file) {
            return
        }

        const result = /^([^.]+)[.].+$/g.exec(file)

        if (!result) {
            return
        }

        let database = null

        switch (result[1]) {
            case 'webdb':
                database = 'WebDB';
                break;

            case 'accountdb':
                database = 'AccountDB';
                break

            case 'gamedb':
                database = 'GameDB'
                break;

            case 'logdb':
                database = 'LogDB'
                break;

            default:
                return
        }

        const model = sequelizes[database]['import'](path.join(__dirname, file))

        db[model.name] = model
    })

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelizes = sequelizes
db.Sequelize = Sequelize

module.exports = db