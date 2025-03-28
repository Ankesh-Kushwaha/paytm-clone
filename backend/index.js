require("dotenv").config();
const express = require("express");
const connectToDb = require("./database/mongo");
const app = express();
const PORT = process.env.PORT || 3000;
const userRoutes=require('./routes/userRoutes')
const cors = require('cors');
const bodyParser = require('body-parser');
const AccountRoutes = require('./routes/accountRoutes');

//middlewares
app.use(cors());
app.use(bodyParser.json());
//app.use(express.json()); //for parsing the incoming body request
connectToDb(); //database connection


//routes
app.use('/api/v1', userRoutes);
app.use('/account', AccountRoutes);



app.listen(PORT,() => {
  console.log(`server is running at port ${PORT}`);
})










