// animalRoute.js

const express = require("express");
const router = express.Router();
const {
  createAnimal,
  getDataByNumberOfDays,
  deleteAnimalById,
  getAnimalColor,
  createPoint,
  getAnimalAvailable,
  bulkInsertAnimals
} = require("../controllers/animalController");


// Add your routes
router.post('/createPoint', createPoint); 
router.post("/bulkInsertAnimals", bulkInsertAnimals)
router.post('/createAnimal', createAnimal);
router.get('/', getAnimalAvailable);
router.get('/getLastThreeMonthsData', getDataByNumberOfDays);
router.get('/getAnimalSummary', getAnimalColor);
router.delete('/deleteAnimal/:id', deleteAnimalById)






// Start the socket server


module.exports = router;




