import Signup from "../models/signup_schema.js";
import Resource from "../models/resource_schema.js";
import PResource from "../models/resource_pending_approval.js";
import Enrollment from "../models/enrollment.js";
import bcrypt from 'bcrypt';



const logout = (req, res) => {
    try {
      // Destroy the user's session
     
      req.session.destroy(err => {
        if (err) {
          console.error('Error destroying session:', err);
          // Handle error, if needed
        } else {
          
          // Redirect the user to the home page or any other appropriate page after logout
          res.redirect('/');
        }
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle error, if needed
    }
  };
  const updateProfile = async (req, res) => {
    try {
      // Extracting user ID from the request parameters
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
      res.redirect(`/profile`);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  };
  const UaddResource = async (req, res) => {
    try {
      // Extract data from the request body
      const { name, category, link, description, image,notification,approval } = req.body;
  
      // Create a new resource object
      const newResource = new PResource({
        name,
        category,
        link,
        description,
        image,
        notification,
        approval,
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

  const getnot = async () => {
    try {
      const notifi = await Resource.find({ notification: true });
      return notifi;
    } catch (error) {
      console.error('Error retrieving resources with notifications:', error);
      throw error;
    }
  };
  
  const enrollment = async (req, res) => {
    const user= req.session.User;
   
    const resourceId = req.params.id;
  
    if (!user) {

      res.redirect("/signin")
}else {
   const userId = user._id;
   const existingEnrollment = await Enrollment.findOne({ user_id: userId, resource_id: resourceId });

   if (existingEnrollment) {
       // User is already enrolled, show message
       console.log("existed");
       res.redirect("/")
      } else {
    const enroll = new Enrollment ({
      user_id:userId,
      resource_id:resourceId,
      
    });
    await enroll.save()
    res.redirect("/")
  }
}
};

const enrolledCourses = async (req, res) => {
  try {
    const user = req.session.User;
    const userId = user._id;
    const enrollments = await Enrollment.find({ user_id: userId });
    
    // Array to store fetched resources
    const enrolledCourses = [];

    for (let i = 0; i < enrollments.length; i++) {
      const resource_id = enrollments[i].resource_id;
      const enrolledCourse = await Resource.findById(resource_id);
      if (enrolledCourse) {
        enrolledCourses.push(enrolledCourse);
      }
    }
    return enrolledCourses;
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    // Handle error appropriately
    res.status(500).json({ error: "Internal server error" });
  }
}

  
  const user_config = {
    logout,
    updateProfile,
    UaddResource,
    getnot,
    enrollment,
    enrolledCourses,
  };
  export default user_config;
  