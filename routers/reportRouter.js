const {createReport, getAllReports, getReportById, updateReportById, deleteReportById} = require('../controllers/reportController');

const router = require('express').Router();

router.post('/create',createReport);
router.get('/all', getAllReports);
router.get('/:id', getReportById);
router.put('/:id', updateReportById);
router.delete('/:id', deleteReportById);

module.exports = router;