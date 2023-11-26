module.exports = (sequelize, DataTypes, db) => {
    const Report = sequelize.define("report", {
        report_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        area_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            references: {
                model: db.areas, // refers to the 'areas' table
                key: 'area_id' // refers to the primary key in the 'areas' table
            }
        },
        report_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        report_description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    
    return Report;
}