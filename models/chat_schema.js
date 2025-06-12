import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User schema for the sender
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ChatSchema = new Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User schema for the participants
    required: true
  }],
  messages: [MessageSchema]
}, {
  timestamps: true
});

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
