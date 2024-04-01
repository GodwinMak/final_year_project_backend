module.exports = (sequelize, DataTypes) =>{
    const AnimalLocation = sequelize.define("animalLocation", {
      animalLocation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      animal_TagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "animals",
          key: "animal_TagId",
        },
        onDelete: "CASCADE",
      },
      animal_location: {
        type: DataTypes.GEOMETRY("POINT"),
        allowNull: false,
      },
    });
    return AnimalLocation;
}