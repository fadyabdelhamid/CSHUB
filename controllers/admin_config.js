import PResource from "../models/resource_pending_approval.js";
import Resource from "../models/resource_schema.js";
import Signup from "../models/signup_schema.js"
import bcrypt from 'bcrypt';


const addResource = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, category, link, description, image,notification } = req.body;

    // Create a new resource object
    const newResource = new Resource({
      name,
      category,
      link,
      description,
      image,
      notification,
    });

    // Save the resource to the database
    const savedResource = await newResource.save();
    
    req.session.User
    res.redirect('/adminDashboard');
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ error: error.message });
  }
};
const updateResource = async (req, res) => {
  try {
    const resourceId = req.params.id; // Extract resource ID from URL parameter
    

    let resource = await Resource.findById(resourceId);
   

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Update resource fields with new values from request body
    resource.name = req.body.name || resource.name;
    resource.category = req.body.category || resource.category;
    resource.notification = req.body.notification || resource.notification;
    resource.link = req.body.link || resource.link;
    resource.description = req.body.description || resource.description;


    // Save the updated resource to the database
    const updatedResource = await resource.save();

    
    req.session.User
    // Send a success response with the updated resource
    res.redirect('/adminDashboard');
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ error: error.message });
  }
};
const approveResource = async (req, res) => {
  try {
    const resourceId = req.params.id;

  const Aresource = await PResource.findById(resourceId);
  const { name, category, link, description, image,notification } =Aresource ;

    // Create a new resource object
    const newResource = new Resource({
      name,
      category,
      link,
      description,
      image,
      notification,
    });

    // Save the resource to the database
    const savedResource = await newResource.save();
    
    req.session.User
    await Aresource.deleteOne();
    res.redirect('/adminDashboard');
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ error: error.message });
  }
}


const deleteResource = async (req, res) => {
  try {
    // Extract resource ID from the request parameters
    const resourceId = req.params.id;

    // Find the resource by ID in the database
    const resource = await Resource.findById(resourceId);

    // If resource not found, return 404 status
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Delete the resource from the database
    await resource.deleteOne();

    // Send a success response
    req.session.User
    res.redirect('/adminDashboard');
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ error: error.message });
  }
};
const udeleteResource = async (req, res) => {
  try {
    // Extract resource ID from the request parameters
    const resourceId = req.params.id;

    // Find the resource by ID in the database
    const resource = await PResource.findById(resourceId);

    // If resource not found, return 404 status
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Delete the resource from the database
    await resource.deleteOne();

    // Send a success response
    req.session.User
    res.redirect('/adminDashboard');
  } catch (error) {
    // If an error occurs, send an error response
    res.status(500).json({ error: error.message });
  }
}

const addUser = async (req, res) => {

  const saltRounds = 10;
  const password = req.body.signupPassword;
  const cpassword=req.body.signupConfirmPassword;

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const hashedcPassword = await bcrypt.hash(cpassword, saltRounds);

  
   // const existingUser = await User.findOne({ mail: req.body.mail });

    /*if (existingUser) {
      console.log("Email already exists");
      res.send("Email already exists");
    } else {*/
    const sign = new Signup ({
        fullname: req.body.signupName,
        mail: req.body.signupEmail,
        password: hashedPassword,
        cpassword: hashedcPassword,
        Type:req.body.Type,
        
      });

      console.log(req.body)
      await sign.save()
    .then( result => {
        res.redirect("/")
    })
    .catch( err => {
        console.log(err)
    })
  
};
const deleteUser = async (req, res) => {
  try {
  const userId = req.params.id;
   // Find the resource by ID in the database
   const user = await Signup.findById(userId);

   // If resource not found, return 404 status
   if (!user) {
     return res.status(404).json({ error: "Resource not found" });
   }

   // Delete the resource from the database
   await user.deleteOne();

   // Send a success response
   req.session.User
   res.redirect('/adminDashboard');
 } catch (error) {
   // If an error occurs, send an error response
   res.status(500).json({ error: error.message });
 }
};
const updateUser = async (req, res) => {
  try {
  const userId = req.params.id;
  const saltRounds = 10;


  // Extracting profile data from the request body
  const { profileName, profileEmail, profilePassword, profileConfirmPassword } = req.body;

  // Validation: Check if passwords match
  if (profilePassword !== profileConfirmPassword) {
    return res.status(400).send("Passwords do not match");
  }

  // Here you can perform further validation or processing of the profile data

  // Assuming you have a User model
  const user = await Signup.findById(userId);
  if (!user) {
    return res.status(404).send("User not found");
  }

  // Update user profile fields
  user.fullname = profileName;
  user.mail = profileEmail;
  
const hashedPassword = await bcrypt.hash(profilePassword, saltRounds);


  if (profilePassword) {
    // Update password only if provided
    user.password = hashedPassword;
    user.cpassword = hashedPassword;
  }

  // Save the updated user object
  await user.save();

  // Redirect or send a success response
  res.redirect(`/adminDashboard`);
} catch (error) {
  console.error(error);
  res.status(500).send(error.message);
}
};




const admin_config = {
  addResource,
  updateResource,
  deleteResource,
  addUser,
  deleteUser,
  updateUser,
  udeleteResource,
  approveResource,
  
};
export default admin_config;
