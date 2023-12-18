// animalRoute.js

const express = require("express");
const router = express.Router();
const {
  createAnimal,
  getLastThreeMonthsData,
  deleteAnimalById,
  getAnimalColor,
  createPoint,
} = require("../controllers/animalController");


// Add your routes
router.post('/createPoint', createPoint); 
router.post('/createAnimal', createAnimal);
router.get('/getLastThreeMonthsData', getLastThreeMonthsData);
router.get('/getAnimalSummary', getAnimalColor);
router.delete('/deleteAnimal/:id', deleteAnimalById)






// Start the socket server


module.exports = router;




