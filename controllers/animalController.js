const db = require("../models");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");
const dayjs = require("dayjs");
const turf = require("@turf/turf");
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
    const animalTagIds = req.query.animalTagIds ? req.query.animalTagIds.split(',') : [];

    const animalData = await Animal.findAll({
      include: [{
        model: Animal_Location,
        required: true,
        order: [['time', 'DESC']],
        limit: 1,
      }],
      where: {
        animal_TagId: {
          [Op.in]: animalTagIds // Filter based on the animalTagIds array
        }
      }
    });

    res.json(animalData);
  } catch (error) {
    // console.error('Error fetching recent animal data:', error);
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


exports.getAnimalLineMap = async (req, res) => {
  try {
    const animalTagIds = req.query.animalTagIds
      ? req.query.animalTagIds.split(",")
      : [];
    const numberOfDays = req.query.numberOfDays
      ? parseInt(req.query.numberOfDays)
      : 0;
    const endDate = new Date();
    const startDate = dayjs(endDate).subtract(numberOfDays, "day").toDate();
    const animals = await Animal_Location.findAll({
      where: {
        time: {
          [Op.between]: [startDate, endDate],
        },
        animal_TagId: {
          [Op.in]: animalTagIds, // Filter based on the animalTagIds array
        },
      },
      include: [
        {
          model: Animal,
          required: true,
          attributes: ["animal_name"],
        },
      ],
      order: [["time", "ASC"]],
    });
    // Group the fetched data by animal_TagId
    const groupedData = animals.reduce((acc, animalLocation) => {
      const { animal_TagId, animal } = animalLocation;
      if (!acc[animal_TagId]) {
        acc[animal_TagId] = {
          animal_name: animal.animal_name,
          animal_TagId: animal_TagId,
          coordinates: [],
        };
      }
      acc[animal_TagId].coordinates.push(animalLocation.animal_location.coordinates);
      return acc;
    }, {});

    // Convert groupedData into the required format
    const formattedData = Object.keys(groupedData).map((animal_TagId) => ({
      animal_name: groupedData[animal_TagId].animal_name,
      animal_TagId: animal_TagId,
      geojson: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: groupedData[animal_TagId].coordinates,
            },
          },
        ],
      },
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({error: error.message})
  }
};


exports.getAnimalPoints = async (req, res) => {
  try {
    const animalTagIds = req.query.animalTagIds
      ? req.query.animalTagIds.split(",")
      : [];
    const numberOfDays = req.query.numberOfDays
      ? parseInt(req.query.numberOfDays)
      : 0;
    const endDate = new Date();
    const startDate = dayjs(endDate).subtract(numberOfDays, "day").toDate();

    const animals = await Animal_Location.findAll({
      where: {
        time: {
          [Op.between]: [startDate, endDate],
        },
        animal_TagId: {
          [Op.in]: animalTagIds,
        },
      },
      include: [
        {
          model: Animal,
          required: true,
          attributes: ["animal_name"],
        },
      ],
      order: [["time", "ASC"]],
    });

    // Group the fetched data by animal_TagId
    const groupedData = animals.reduce((acc, animalLocation) => {
      const { animal_TagId, animal } = animalLocation;
      if (!acc[animal_TagId]) {
        acc[animal_TagId] = {
          animal_name: animal.animal_name,
          animal_TagId: animal_TagId,
          points: [],
        };
      }
      acc[animal_TagId].points.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: animalLocation.animal_location.coordinates,
        },
        properties: {},
      });
      return acc;
    }, {});

    // Convert groupedData into the required format
    const formattedData = Object.keys(groupedData).map((animal_TagId) => ({
      animal_name: groupedData[animal_TagId].animal_name,
      animal_TagId: animal_TagId,
      geojson: {
        type: "FeatureCollection",
        features: groupedData[animal_TagId].points,
      },
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAnimalStas  = async (req, res) => {
  try {
    const areaId = req.query.areaId; // Get the areaId from query params
    

    const animals = await Animal_Location.findAll({
      
      include: [
        {
          model: Animal,
          required: true,
          attributes: ["animal_name"],
        },
      ],
      order: [
        ["animal_TagId", "ASC"],
        ["time", "ASC"],
      ],
    });

    const groupedData = animals.reduce((acc, location) => {
      const { animal_TagId, time, animal_location, animal } = location;
      if (!acc[animal_TagId]) {
        acc[animal_TagId] = {
          animal_name: animal.animal_name,
          animal_TagId: animal_TagId,
          locations: [],
        };
      }
      acc[animal_TagId].locations.push({
        time,
        coordinates: animal_location.coordinates,
      });
      return acc;
    }, {});

    const results = Object.keys(groupedData).map((animal_TagId) => {
      const { animal_name, locations } = groupedData[animal_TagId];
      let totalDistance = 0;
      const distances = [];

      for (let i = 1; i < locations.length; i++) {
        const from = turf.point(locations[i - 1].coordinates);
        const to = turf.point(locations[i].coordinates);
        const distance = turf.distance(from, to, { units: "kilometers" });
        const timeDiff =
          (new Date(locations[i].time) - new Date(locations[i - 1].time)) /
          3600000; // in hours

        const speed = distance / timeDiff;
        totalDistance += distance;

        distances.push({
          min_distance_km: distance,
          min_speed_kmh: speed,
          total_distance_km: totalDistance,
          time: locations[i].time,
        });
      }

      return {
        animal_name,
        animal_TagId,
        movements: distances,
      };
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}