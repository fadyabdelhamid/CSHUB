import Signup from "../models/signup_schema.js";
import bcrypt from 'bcrypt';

const signinform = async (req, res) => {
  try {
    const {logmail, logpassword }= req.body;
   
    const user = await Signup.findOne({ mail: logmail });

    if (user) {
     
      const passwordMatch = await bcrypt.compare(logpassword, user.password);

      if (passwordMatch) {
        console.log("User found and password matched:", user);
        req.session.User = user;
        if(req.session.User.Type==='user'){
   
          res.json({ success: true, redirectUrl: '/', user: req.session.User } );
  
        }
    else{
   
         
      res.json({ success: true, redirectUrl: '/', user: req.session.User } );
    }
        
      } else {
        console.log("Password mismatch.");
        res.json({ success: false, message: 'Password mismatch.' });
        
      }
    } else {
      console.log("User not found.");
      res.json({ success: false, message: 'User not found.' });
      
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
   
  }
};

const exportsignin = {
  signinform,
};
export default exportsignin;




