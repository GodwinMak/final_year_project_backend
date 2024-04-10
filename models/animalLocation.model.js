module.exports = (sequelize, DataTypes) =>{
    const AnimalLocation = sequelize.define("animalLocation", {
      animalLocation_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      animal_TagId: {
        type: DataTypes.UUID,
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
      device_status:{
        type: DataTypes.JSON, // Assuming device status can be represented as JSON
        allowNull: false,
      }
    }
  );
    return AnimalLocation;
}