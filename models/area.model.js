module.exports = (sequelize, DataTypes) => {
    const Area = sequelize.define("area", {
        area_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        area_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
       area_location: {
            type: DataTypes.GEOMETRY('POINT'),
            allowNull: false,
       },
        area_polygon:{
            type: DataTypes.GEOMETRY('POLYGON'),
        },
        area_area:{
            type: DataTypes.FLOAT,
            allowNull: false
        }
    });

    return Area;
}