import { Router } from 'express';
import Resource from "../models/resource_schema.js";
import {getAI,getcyber,getsoftware,search,resourcesDetails} from "../controllers/coursesController.js"




var router = Router();

router.get('/resources',  async function (req, res) {
    const resources = await Resource.find();
    req.session.Resource=resources;
    
  
res.render("pages/resources",{ resource: resources,user: req.session.User });

 
});

router.get('/ai',getAI);
router.get('/cybersecurity',getcyber);
router.get('/softwareengineer',getsoftware);
router.get('/search',search)
router.get('/resourcesDetails/:id', async function(req, res) {
    try {
        const resource = await resourcesDetails(req, res);  // Pass req, res
        res.render("pages/resourcesDetails", { user: req.session.User, resource });
    } catch (error) {
        res.status(500).send(error.message);
    }
});
export default router;