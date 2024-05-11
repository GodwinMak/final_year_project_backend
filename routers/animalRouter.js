// animalRoute.js

const express = require("express");
const router = express.Router();
const {
  createAnimal,
  deleteAnimalById,
  getAnimalColor,
  createPoint,
  getAnimalAvailable,
  bulkInsertAnimals,
  getRealTimeAnimalData,
  getData
} = require("../controllers/animalController");


// Add your routes
router.post('/createPoint', createPoint); 
router.post("/bulkInsertAnimals", bulkInsertAnimals)
router.post('/createAnimal', createAnimal);
router.get('/', getAnimalAvailable);
router.get('/realtime', getRealTimeAnimalData)
router.get('/getData', getData);
router.get('/getColour', getAnimalColor);
router.delete('/deleteAnimal/:id', deleteAnimalById)






// Start the socket server


module.exports = router;




