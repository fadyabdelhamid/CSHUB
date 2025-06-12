import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    link: { type: String, required: false },
    description: { type: String, required: true },
    image: { type: String , required: true } ,// Define image field as Buffer data type
    notification:{ type:Boolean ,required:true},
    approval :{ type:Boolean ,required:true}

  },
  {
    timestamps: true,
  }
);

const PResource = mongoose.model("PResource", resourceSchema);

export default PResource;

