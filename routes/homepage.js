import { Router } from 'express';



var router = Router();

router.get('/', function(req, res) {
 

res.render("pages/index",{user: req.session.User  });

 
});


export default router;