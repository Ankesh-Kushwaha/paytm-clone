const express = require('express');
const router = express.Router();
const { userLogin, userSignUp, getAllUsers,updateUserData } = require('../controllers/userController');
const authMiddleware=require('../middleware/authmiddleware')

router.post('/signup', userSignUp);
router.post('/login', userLogin);
router.get('/get',authMiddleware, getAllUsers);
router.put('/update/:userId', authMiddleware, updateUserData);



module.exports = router;
