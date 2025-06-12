import { Router } from 'express';
import  signupform  from '../controllers/signup_config.js'




var router = Router();

router.get('/signup', function(req, res) {
 
  
res.render("pages/signup");

 
});


router.post("/signupform",signupform.signupform);


export default router;