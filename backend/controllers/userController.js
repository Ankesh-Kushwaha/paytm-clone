const User = require('../schema/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { zodUserSchemaSignUp,zodUserSchemaSignIn,zodSchemaUpdate } = require('../utils/zodverification')
const authMiddleware = require('../middleware/authmiddleware');
const jwt = require('jsonwebtoken');
const Account = require('../schema/account');


const userSignUp = async (req, res) => {
  try {
    const { userName, firstName, lastName, password, email } = req.body;
    // Validate user input using Zod
    const { success } = zodUserSchemaSignUp.safeParse(req.body);
     if (!success) {
    return res.status(400).json({ success: false, message: "Invalid input data" });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email:email });
    if (existingUser) {
      return res.status(402).json({
        success: false,
        message: "User already exists",
      });
    }

    // FIX: Await the salt generation
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = new User({
      userName,
      firstName,
      lastName,
      password: hashPassword, // Hashed password
      email,
    });

    await newUser.save();

    const userId = newUser._id;

    //Create an account with a random balance
    const newAccount=new Account({
      userId,
      balance: 1 + Math.random() * 1000,
    });

    await newAccount.save();

    return res.status(200).json({
      success: true,
      message: "User created successfully!",
    });

  } catch (err) {
    console.error("Error while signUp:", err);
    res.status(500).json({
      success: false,
      message: "Error while signing up",
      error: err.message,
    });
  }
};



const userLogin =async (req, res) => {
  try {
    const body = req.body;
    const { success } = zodUserSchemaSignIn.safeParse(body);
    if (!success) {
      return res.status(400).json({
        success: false,
        message:"user data is invalid.Please try again"
       })
    }
   
    //retrieve the user from database
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message:"User does not exist.Please signUp before login"
      })
    }
    
    //compare the password and email
    const password = await bcrypt.compare(body.password, user.password);
    if (!password) {
      return res.status(400).json({
        success: false,
        message:"Password is incorrect"
       })
    }
    else {
      //jwt sign in 
      const token = jwt.sign({
        userId: user._id,
        userName: user.userName,
        email:user.email,
      }, process.env.JWT_SECRET_KEY, {
        expiresIn:'1h'
      })

      return res.status(200).json({
        success: true,
        message: "User Logged in succesfully",
        data:token
      })
    }
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message:"something went wrong while login"
      }) 
  }
}


const getAllUsers =async (req, res) => {
  const users = await User.find().select("-password"); //conatain user data without password
  return res.status(200).json({
    success: true,
    message: "All users fethched successfully !",
    data: users,
  })
}

const updateUserData = async (req, res) => {
  try {
    const body = req.body;
    const userId = req.params.userId;

    // Validate input using Zod
    const { success } = zodSchemaUpdate.safeParse(body);
    if (!success) {
      return res.status(403).json({
        success: false,
        message: "Please provide correct data to update",
      });
    }

    // Check if user exists before updating
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user data
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Send response
    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later.",
    });
  }
};

//implement the global search here to find the user based on the data provided by the fronted user
const searchGlobal = async (req, res) => {
  const filter = req.query.filter || " ";
  if (filter === " ") {
    return res.json({
       user:[],
    })
  }

  const users = await User.find({
    $or: [
      {
        firstName:{$regex:filter},   
      },
      {
        lastName:{$regex:filter},    
      }
       ]
  })
 


  res.status(200).json({
    users: users.map(user => ({
      firstName: user.firstName,
      lastName: user.lastName,
      _id:user._id,
     }))
  })
}

const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(403).json({
      success: true,
      message:"please provide an userId to delete the user"
     })
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(403).json({
      success: false,
      message:"user does not exist.Please provide a valid id"
     })
  }
  else {
    //delete the user 
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      success: true,
      message:"user deleted successFully !"
    })
  }
}

module.exports = {
  userSignUp,
  userLogin,
  getAllUsers,
  updateUserData,
  searchGlobal,
  deleteUser,
}