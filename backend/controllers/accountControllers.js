const { default: mongoose } = require('mongoose');
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

//initiating the transaction between the two user using the session in data_base;
const transferFund = async(req, res) => {
  try {
    const session = await mongoose.startSession();
    //initiate the transaction
    session.startTransaction();
    const { amount, to } = req.body;//get amount and the user with whom the transaction is done
    const userId = req.userId;
    //fetch the account of the user
    //session(session) is use to ensure that the transaction is within the active session
    const account = await Account.findOne({ userId: userId }).session(session);
    
    if (!account || account.balance< amount) {
      res.status(403).json({
        success: false,
        message: "either the account does not exist or balance is low",
        balance:account.balance,
       })
    }
   
    //find the account of the user whom the transaction is to be done
    const toAccount = await Account.findOne({ userId: to }).session(session);

    //perform the transaction
    await Account.updateOne({ userId: userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction(); //commit the transaction
    res.status(200).json({
      success: true,
      message: "transfer done successfully",
      info:`${amount} is transfered from ${userId} to ${to} `
    })
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: "something went wrong while trxn. trxn failed",
      error:err.message,
      })
  }
}





module.exports = {
  getBalance,
  transferFund
}