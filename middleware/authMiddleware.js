const jwt = require('jsonwebtoken');
const Client = require('../models/client-model');


const authent = (req, res, next) => {
  const usser = res.locals.user;
  if(usser){
    if((usser.role == '1' || usser.role == '2')) next();
    else res.json({success: false, message: "Access not Allowed for you."});
  }
  else{
    res.json({success: false, message: "Redirect to Login Page from authentication process"});
  }
}

const editor = (req, res, next) => {
  const usser = res.locals.user;
  if(usser){
    if((usser.role == '2')) next();
    else res.json({success: false, message: "Access not Allowed for you."});
  }
  else{
    res.json({success: false, message: "Redirect to Login Page from editor process"});
  }
}

const admin = (req, res, next) => {
  const usser = res.locals.user;
  if(usser){
    if((usser.role == '1')) next();
    else res.json({success: false, message: "Access not Allowed for you."});
  }
  else{
    res.json({success: false, message: "Redirect to Login Page from admin process"});
  }
}

const checkUser = async(req, res, next) => { // Checks whether there exists any user or not. // If exists then it will set its value in res.locals
    await Client.find ()
       .then(clientData => {
         if(clientData.length===0){
           res.json({success: false, message: 'Signin as Super Admin for your company.'});
         }
       })                                   
    const token = req.cookies.jwt;
    if (token) {
      console.log(token);
      jwt.verify(token, 'billbook webapp', async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          console.log("Token Not Available");
          next();
        } else {
          console.log(decodedToken);
          await Client.find()
            .then((clientData) => {
                const user = clientData[0].users.filter(user => user._id == decodedToken.id);
                // console.log(user);
                res.locals.user = user[0];
                // console.log(res.locals.user);
                next();
            })
        }
      });
    } else {
      res.locals.user = null;
      console.log("Token Not Available");
      next();
    }
};
  
module.exports = { authent, editor, admin, checkUser};