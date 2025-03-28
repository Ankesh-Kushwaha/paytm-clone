const express = require('express');
const router = express.Router();
const { userLogin, userSignUp, getAllUsers,updateUserData,searchGlobal,deleteUser, deleteAllUser} = require('../controllers/userController');
const authMiddleware=require('../middleware/authmiddleware')

router.post('/signup', userSignUp);
router.post('/login', userLogin);
router.get('/get',authMiddleware, getAllUsers);
router.put('/update/:userId', authMiddleware, updateUserData);
router.get('/user', authMiddleware, searchGlobal)
router.delete('/user/:userId', authMiddleware, deleteUser)



module.exports = router;
