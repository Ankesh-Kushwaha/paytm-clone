const mongoose = require('mongoose');

//connect to mongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to database successFully");
  }
  catch(err) {
    console.log("erro while connecting to database", err);
  }
}

module.exports = connectToDB;