const db = require("../models");

// creat main model
const Animal_point = db.animals;

// main work
// 1. create and save new animal

exports.createAnimal_point = async (req, res) => {
    try {
        const {animal_name, longitude, latitude} = req.body;

        const animal = await Animal_point.create({
            animal_name: animal_name,
            animal_location: animal_location,
            longitude: longitude,
            latitude: latitude 
        })
        res.status(200).send(animal);
    } catch (error) {
        res.status(400).json({error: error.message}); 
    }
};

// TODO the controller that will be used in animal_point will be done in future depending on the need of the project