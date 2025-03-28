const Account = require('../schema/account');

//controller to get the balance of the user
const getBalance =async (req, res) => {
  try {
    const userId = req.params.userId;
    const account = await Account.findOne({
         userId:userId,
    }) 
    
    if (!account) {
      return res.status(403).json({
        success: false,
        message:"user does not exist"
        })
    }
    else {
      return res.status(200).json({
        success: true,
        balance:account.balance
       })
    }
  }
  catch (err) {
    return res.status(500).json({
      success: false,
      message:"error while fetching the balance"
     })
  }
}

const transferFund = (req, res) => {
  
}

module.exports = {
  getBalance,
  transferFund
}