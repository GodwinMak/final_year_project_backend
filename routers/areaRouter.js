const {createArea, getAllAreas, getAreaById, updateAreaById, deleteAreaById} = require('../controllers/areaController');

const router = require('express').Router();

router.post('/create', createArea);
router.get('/all', getAllAreas);
router.get('/:id', getAreaById);
router.put('/:id', updateAreaById);
router.delete('/:id', deleteAreaById);

module.exports = router;