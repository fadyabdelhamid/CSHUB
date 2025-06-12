import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    link: { type: String, required: false },
    description: { type: String, required: true },
    image: { type: String , required: true } ,// Define image field as Buffer data type
    notification:{ type:Boolean ,required:true}
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;

