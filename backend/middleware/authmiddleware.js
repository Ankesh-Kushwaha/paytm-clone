const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
 
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({
      success: false,
      message:"auth Header error"
     })
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message:"token does not exist"
     })
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY); //verify the token
    req.userId = decode.userId;
    next(); //call for the next middleware;
  }
  catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message:"something went wrong in authMiddleware"
    })
  }
}


module.exports = authMiddleware;