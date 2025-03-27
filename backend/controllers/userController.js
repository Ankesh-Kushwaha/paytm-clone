const User = require('../schema/user');
const bcrypt = require('bcryptjs');
const { zodUserSchemaSignUp,zodUserSchemaSignIn,zodSchemaUpdate } = require('../utils/zodverification')
const authMiddleware = require('../middleware/authmiddleware');
const jwt = require('jsonwebtoken');


const userSignUp = async (req, res) => {
  try {
    const body = req.body;
    const { success } = zodUserSchemaSignUp.safeParse(body); // check the zod verification
    if (!success) {
      return res.status(400).json({
        success: false,
        message: "User data is invalid. Please try again"
      });
    }

    // 🔴 FIXED: Use await to get the actual user
    const user = await User.findOne({ email: body.email }); 
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // If the user is not found, proceed with hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);

    // Create a new user
    const newUser = new User({
      userName: body.userName,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: hashedPassword
    });

    // Save the newly created user
    await newUser.save();

    // Create the JWT token
    const token = jsonwebtoken.sign({
      userId: newUser._id,
      userName: body.userName,
      email: body.email
    }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h'
    });

    console.log(token);

    // Send the response
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      data: token,
    });

  } catch (err) {
    console.log("error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
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


module.exports = {
  userSignUp,
  userLogin,
  getAllUsers,
  updateUserData
}