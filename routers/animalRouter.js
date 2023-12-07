// animalRoute.js

const express = require("express");
const router = express.Router();
const {
  createAnimal_point,
  getLastThreeMonthsData,
  deleteAnimalById,
  getAnimalColor,
} = require("../controllers/animalController");


// Add your routes
router.post('/createAnimal_point', createAnimal_point);
router.get('/getLastThreeMonthsData', getLastThreeMonthsData);
router.get('/getAnimalSummary', getAnimalColor);
router.delete('/deleteAnimal/:id', deleteAnimalById)






// Start the socket server


module.exports = router;




