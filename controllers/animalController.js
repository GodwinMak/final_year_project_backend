const db = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

// creat main model
const Animal = db.animals;
const Animal_Location = db.animalLocations

const Area = db.areas;

// create a controller that will be used to create location point from the gps device
exports.createPoint = async (req, res) =>{
  try {
    const {animal_TagId, animal_location} = req.body
    const animal = await Animal.findOne({
      where: { animal_TagId: animal_TagId },
    });
     if (!animal) {
       return res.status(404).json({ message: "Animal not found with the provided animal_TagId" });
     }

     const animal_point = await Animal_Location.create({
      animal_TagId: animal_TagId, 
      animal_location: animal_location
     })

     res.status(200).json(animal_point);
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}
// main work
// 1. create and save new animal

exports.createAnimal = async (req, res) => {
  try {
    const { animal_name, animal_sex, animal_TagId, area_id } = req.body;

    // Check if the provided area_id exists in the areas table
    const area = await Area.findByPk(area_id);
    if (!area) {
      return res.status(404).json({ message: "Area not found with the provided area_id" });
    }

    const animal = await Animal.create({
      animal_name: animal_name,
      animal_TagId: animal_TagId,
      animal_sex: animal_sex,
      area_id: area_id,
    });
    res.status(200).send(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Controller to get last three months data
exports.getLastThreeMonthsData = async (req, res) => {
  try {
    const latestAnimal = await Animal_Location.findOne({
      order: [["createdAt", "DESC"]],
    });

    if (!latestAnimal) {
      // If there is no data in the database, return an empty array
      return res.json([]);
    }
    const currentDate = new Date(latestAnimal.createdAt);
    const threeMonthsAgo = new Date(currentDate);
    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

    const animalsData = await Animal_Location.findAll({
      attributes: { exclude: ["animalLocation_id"] },
      // where: {
      //   createdAt: {
      //     [Op.gte]: threeMonthsAgo,
      //   },
      // },
      order: [["animal_TagId"], ["createdAt"]],
      include: [
        {
          model: Animal,
          attributes: ["animal_name", "animal_sex"],
        },
      ],
    });
    res.json(animalsData);
    // // Check if there are no locations available for animals
    // if (animalsData.every((animal) => !animal.animal_location)) {
    //   return res
    //     .status(404)
    //     .json({ message: "No location available for animals." });
    // }
    // // Group the data by animal_TagId
    // const groupedData = animalsData.reduce((acc, animal) => {
    //   const animalTagId = animal.animal_TagId;

    //   if (!acc[animalTagId]) {
    //     acc[animalTagId] = {
    //       animal_name: animal.animal_name,
    //       path: [],
    //     };
    //   }

    //   acc[animalTagId].path.push([
    //     animal.animal_location.coordinates[0],
    //     animal.animal_location.coordinates[1],
    //   ]);

    //   return acc;
    // }, {});

    // // Convert the grouped data into the desired output format
    // const result = Object.entries(groupedData).map(([animalTagId, data]) => ({
    //   animal_name: data.animal_name,
    //   animal_TagId: parseInt(animalTagId, 10),
    //   path: data.path,
    // }));

    // res.status(200).json({ result, animalsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Helper function to generate RGB values based on animal_id
const generateRGBFunction = (animalId) => {
  const numericAnimalId = parseInt(animalId.id, 10);
  const numDistinctColors = 360;
  const hue = (numericAnimalId % numDistinctColors) / numDistinctColors;
  const saturation = 0.7;
  const value = 0.9;
  let r, g, b;
  let i = Math.floor(hue * 6);
  let f = hue * 6 - i;
  let p = value * (1 - saturation);
  let q = value * (1 - f * saturation);
  let t = value * (1 - (1 - f) * saturation);
  switch (i % 6) {
    case 0:
      (r = value), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = value), (b = p);
      break;
    case 2:
      (r = p), (g = value), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = value);
      break;
    case 4:
      (r = t), (g = p), (b = value);
      break;
    case 5:
      (r = value), (g = p), (b = q);
      break;
  }
  return {
    name: animalId.name,
    id: animalId.id,
    color: [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)],
  };
};

exports.getAnimalColor = async (req, res) => {
  try {
    const result = await Animal.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("animal_name")), "name"],
        ["animal_TagId", "id"],
      ],
      raw: true,
    });
    if (result.length > 0) {
      const rgb = result.map((r) => generateRGBFunction(r));
      res.status(200).json(rgb);
    } else {
      res.status(200).json([]); // or handle it as needed
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error });
  }
};

//3 delete animal data by id

exports.deleteAnimalById = async (req, res) => {
  try {
    await Animal.destroy({ where: { animal_id: req.params.id } });
    res.status(200).json({ message: "Animal deteled successfully" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
