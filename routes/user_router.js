import { Router } from 'express';
import { uploadImage } from "../controllers/uploadControllers.js";
import  signinform  from '../controllers/signin_config.js'
import  user_config from '../controllers/user_config.js'
import { isAuth } from "../controllers/authusers.js";





var router = Router();

router.get('/signin', function(req, res) {
res.render("pages/signin");
});

router.get('/profile', isAuth ,function(req, res) {
    res.render("pages/profile",{user: req.session.User });
    });
    
router.get('/uaddresource', isAuth ,function(req, res) {
    res.render("pages/user_addresource",{user: req.session.User });
    });
    

router.get('/notification', isAuth, async (req, res) => {
        try {
          // Call the getnot function from user_config and await its result
          const resources = await user_config.getnot();
          
          // Render the page with the retrieved resources
          res.render('pages/notification', { resources,user: req.session.User  });
        } catch (error) {
          console.error('Error retrieving notifications:', error);
          res.status(500).send('Server Error');
        }
      });

router.get('/yourcourses', isAuth ,async function(req, res) {
    const resources = await user_config.enrolledCourses(req,res);  // Pass req, res
    res.render("pages/enrolledCourses",{user: req.session.User, resources });
});

router.post("/",signinform.signinform);
router.post("/logout",user_config.logout);
router.post("/profile/:id",user_config.updateProfile);
router.post("/uaddresource", uploadImage ,user_config.UaddResource);
router.post("/enroll/:id",  user_config.enrollment);


export default router;