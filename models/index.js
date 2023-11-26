const dbConfig = require("../config/dbConfig.js");
const {Sequelize, DataTypes} = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB, 
    dbConfig.USER, 
    dbConfig.PASSWORD, { 
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;



db.animals = require("./animal.model.js")(sequelize, DataTypes);
db.users = require("./user.model.js")(sequelize, DataTypes);
db.areas = require("./area.model.js")(sequelize, DataTypes);
db.reports = require("./report.model.js")(sequelize, DataTypes, db);

// Define associations after defining all models
db.areas.hasMany(db.animals, { foreignKey: 'area_id' });
db.animals.belongsTo(db.areas, { foreignKey: 'area_id' });

db.areas.hasMany(db.users, { foreignKey: 'area_id' });
db.users.belongsTo(db.areas, { foreignKey: 'area_id' });

db.areas.hasMany(db.reports, { foreignKey: 'area_id' });
db.reports.belongsTo(db.areas, { foreignKey: 'area_id' });

db.sequelize.sync({alter: true}).then(() => {})
.then(() => {
    console.log("Yes re-sync done.");
});

module.exports = db;