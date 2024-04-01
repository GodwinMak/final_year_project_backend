module.exports = (sequelize, DataTypes, db) => {
    const Report = sequelize.define("report", {
        report_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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