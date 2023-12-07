import mongoose from "mongoose";

const MessagesSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    fileURL: String,
    filePath: String,
  },
  { timestamps: true }
);

export default mongoose.model("Messages", MessagesSchema);
