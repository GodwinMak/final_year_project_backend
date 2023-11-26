const {createUser, loginUser, findAllUsers, findUserById, updateUserById, deleteUserById, changePassword} = require('../controllers/userController');

const router = require('express').Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/all', findAllUsers);
router.get('/:id', findUserById);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);
router.put('/changePassword/:id', changePassword);


module.exports = router;