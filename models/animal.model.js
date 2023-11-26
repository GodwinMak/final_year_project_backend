module.exports = (sequelize, DataTypes) => {
    const Animal = sequelize.define("animal", {
        animal_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        animal_name: {
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
        }
    });

    return Animal;
}