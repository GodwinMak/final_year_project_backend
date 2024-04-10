module.exports = (sequelize, DataTypes) => {
    const Animal = sequelize.define("animal", {
      animal_TagId: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      animal_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      animal_sex: {
        type: DataTypes.ENUM(["female", "male"]),
        allowNull: false,
      },
      animal_birthDay:{
        type: DataTypes.DATE,
        allowNull: false,
      },
      animal_description:{
        type: DataTypes.TEXT,
        allowNull: false
      }, 
      area_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "areas", // Assuming your area model is named 'area'; adjust this if needed
          key: "area_id",
        },
        onDelete: "CASCADE", // Adjust the deletion behavior as needed
      },
    }
  );

    return Animal;
}
