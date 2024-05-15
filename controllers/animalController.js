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
    const {animal_TagId, animal_location, device_status, time} = req.body
    const animal = await Animal.findOne({
      where: { animal_TagId: animal_TagId },
    });
     if (!animal) {
       return res.status(404).json({ message: "Animal not found with the provided animal_TagId" });
     }

     const animal_point = await Animal_Location.create({
      animal_TagId: animal_TagId, 
      animal_location: animal_location,
      device_status: device_status,
      time: time
     })

     res.status(200).json(animal_point);
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// it will be deleted 
exports.bulkInsertAnimals = async (req, res) => {
    try {
        // Insert data into the database in bulk
      const insertedAnimals = await Animal_Location.bulkCreate(req.body);

        res.status(201).json({ success: true, data: insertedAnimals });
    } catch (error) {
        res.status(500).json({error: error.message });
    }
};

exports.getRealTimeAnimalData = async (req, res) => {
  try {
    // Extract animalTagIds from the query parameters
    const { animalTagIds } = req.query;

    // If animalTagIds is not provided or empty, return a bad request response
    if (!animalTagIds || animalTagIds.length === 0) {
      return res.status(400).json({ error: 'Animal IDs are required' });
    }

    const animalDataPromises = animalTagIds.map(async (animalTagId) => {
      return await Animal.findOne({
        where: { animal_TagId: animalTagId },
        include: [{
          model: Animal_Location,
          required: true,
          order: [['time', 'DESC']],
          limit: 1,
        }],
      })
    })
    const animalData = await Promise.all(animalDataPromises);
    res.json(animalData);
  } catch (error) {
    console.error('Error fetching real-time animal data:', error);
    res.status(500).json({ error: error.message });
  }
};



exports.getData = async (req, res) => {
  try {
    // Get the list of animal_TagId values from the request query
    const animalTagIds = req.query.animalTagIds ? req.query.animalTagIds.split(',') : [];

    // Check if the user provided the numberOfDays parameter
    const numberOfDays = parseInt(req.query.numberOfDays);
    let whereCondition = {};

    if (!isNaN(numberOfDays)) {
      const mostRecentDataPromises = animalTagIds.map(async (animalTagId) => {
        return await Animal_Location.findOne({
          where: { animal_TagId: animalTagId },
          order: [['time', 'DESC']],
        });
      });

      // Wait for all promises to resolve
      const mostRecentDataResults = await Promise.all(mostRecentDataPromises);

      // Calculate the start date based on the most recent data for each animal
      const startDateByAnimal = mostRecentDataResults.map((mostRecentData) => {
        return new Date(new Date(mostRecentData.time) - numberOfDays * 24 * 60 * 60 * 1000);
      });

      // For each animal, fetch location data for the specified number of days from the most recent data
      const animalDataPromises = animalTagIds.map(async (animalTagId, index) => {
        return await Animal_Location.findAll({
          include: [{
            model: Animal,
            required: true,
          }],
          where: {
            animal_TagId: animalTagId,
            time: {
              [Op.gte]: startDateByAnimal[index]
            }
          },
          order: [['time', 'DESC']],
        });
      });

      // Execute all promises concurrently
      const animalData = await Promise.all(animalDataPromises);
      return res.json(animalData);
    }else{
      // If numberOfDays is not provided or invalid, return recent data for each animal
      const animalDataPromises = animalTagIds.map(async (animalTagId) => {
        // Find the most recent data for each animal
        const mostRecentData = await Animal_Location.findOne({
          where: { animal_TagId: animalTagId },
          order: [['time', 'DESC']],
        });

        // If mostRecentData exists, filter data for the past 24 hours
        if (mostRecentData) {
          whereCondition.time = {
            [Op.gte]: new Date(mostRecentData.time - 24 * 60 * 60 * 1000)
          };
        }

        // Fetch animal location data for each animal
        return await Animal_Location.findAll({
          include: [{
            model: Animal,
            required: true,
          }],
          where: whereCondition,
          order: [['time', 'DESC']],
        });
      });

      // Execute all promises concurrently
      const animalData = await Promise.all(animalDataPromises);
      res.json(animalData);
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.createAnimal = async (req, res) => {
  try {
    const { animal_name, animal_sex, animal_TagId, area_id, animal_birth_date, animal_description } = req.body;

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
      animal_birthDay: animal_birth_date,
      animal_description: animal_description
    });
    res.status(200).send(animal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Helper function to generate RGB values based on animal_id
const generateRGBFunction = (animal) => {
  // Extract the numeric part from the animal name
  const numericAnimalId = parseInt(animal.name.split('_')[1]);
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
    name: animal.name,
    id: animal.id,
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


exports.deleteAnimalById = async (req, res) => {
  try {
    await Animal.destroy({ where: { animal_TagId: req.params.id } });
    res.status(200).json({ message: "Animal deteled successfully" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};


exports.getAnimalAvailable = async (req, res) => {
  try {
    const {page = 1} = req.query;
    const maxPageSize = 10;

    // Fetch the number of available animals
    const totalCount = await Animal.count();

    // Calculate the dynamic pageSize based on total users
    const pageSize = Math.min(maxPageSize, totalCount);

    // calculate the offset based on the requested page and dynamic pageSize
    const offset = (page - 1) * pageSize;

    const { count, rows: animals } = await Animal.findAndCountAll({
      limit: pageSize,
      offset,
      include: [
        {
          model: Area,
          attributes: ["area_name"],
          required: true
        }
      ]
    })
    const totalPages = Math.ceil(count / pageSize);

    res.status(200).json({
      animals,
      meta: {
        totalUsers: count,
        totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

