module.exports = (sequelize, DataTypes) => {
    const Animal = sequelize.define("animal", {
      animal_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      animal_TagId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      animal_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      animal_location: {
        type: DataTypes.GEOMETRY("POINT"),
        allowNull: false,
      },
      area_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "areas", // Assuming your area model is named 'area'; adjust this if needed
          key: "area_id",
        },
        onDelete: "CASCADE", // Adjust the deletion behavior as needed
      },
    });

    return Animal;
}
