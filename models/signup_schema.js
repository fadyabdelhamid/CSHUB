import mongoose from "mongoose";

const Schema = mongoose.Schema;


const SignupSchema = new Schema({
  fullname: { type: String,required: true},
  mail: { type: String,required: true,match: [/\S+@\S+\.\S+/, "is invalid"],},
  password: {type: String,required: true,minlength: 8  },
  cpassword: {type: String,required: true, },
  Type: { type: String,required: true },

}, {
   timestamps: true 
  });



// Create a model based on that schema
const Signup = mongoose.model("users",SignupSchema);
// export the model
//module.exports=Signup
export default Signup
