import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
  } catch (error) {
    console.log("Connection failed", err);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

app.use(express.json());
app.use(cors());

app.listen(4441, (err) => {
  if (err) {
    return console.log(err);
  }
  connect();
  console.log("Conection success");
  console.log("Server is working!!!");
});
