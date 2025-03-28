const express = require('express');
const router = express.Router();
const authMiddleware=require('../middleware/authmiddleware')
const {getBalance,transferFund}=require('../controllers/accountControllers')

router.use(authMiddleware);
router.get('/balance/:userId', getBalance);
router.post('/transfer', transferFund);


module.exports = router;