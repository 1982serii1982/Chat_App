import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import authRoute from "./routes/auth.js";
import messageRoute from "./routes/message.js";
import MessagesModel from "./models/Messages.js";
import UserModel from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use(cookieParser());
//https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.json());

/**************************************************************************************************** */

const whitelist = ["http://localhost:5171"];

//https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b
app.use(
  cors({
    origin: function (origin, callback) {
      if (origin && whitelist.indexOf(origin) === -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
    credentials: true,
  })
);
/**************************************************************************************************** */

app.use("/getImg", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

app.use((err, req, res, next) => {
  //About this at https://expressjs.com/en/guide/error-handling.html
  //https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  //About 'res' at https://medium.com/gist-for-js/use-of-res-json-vs-res-send-vs-res-end-in-express-b50688c0cddf
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const server = app.listen(4441, (err) => {
  if (err) {
    return console.log(err);
  }
  connect();
  console.log("Conection success");
  console.log("Server is working!!!");
});
/**************************************************************************************************** */
/*******************************   WEB-SOCKET SERVER  *********************************************** */
const wss = new WebSocketServer({ server });

function resetInterval() {}

//notify everyone about connected people
const notifyAboutOnlinePeople = async () => {
  let allUsers;

  try {
    allUsers = await UserModel.find().exec();
  } catch (error) {
    console.log(error);
  }

  [...wss.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...wss.clients].map((c) => {
          return { userId: c.userId, userEmail: c.userEmail };
        }),
        all: allUsers,
      })
    );
  });
};

let interval = setInterval(() => {
  [...wss.clients].forEach((client) => {
    if (client.isAlive === false) return client.terminate();

    client.isAlive = false;
    client.ping();
  });
}, 5000);

//   connection.ping();
//   connection.timer = setTimeout(() => {
//     connection.terminate();
//     notifyAboutOnlinePeople();
//     resetInterval();
//     // console.log(
//     //   `Previous connection with ${connection.userEmail} terminated`
//     // );
//   }, 1500);
// }, 5000);

//read useremail and userid from cookie for this connection
wss.on("connection", (connection, req) => {
  connection.isAlive = true;
  const cookie = req.headers.cookie;

  if (cookie) {
    const token = cookie.split("=")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      connection.userId = decoded._id;
      connection.userEmail = decoded.email;
    } else {
      return;
    }
  }

  connection.on("pong", () => {
    connection.isAlive = true;
  });

  connection.on("message", async (message) => {
    try {
      const { destId, destEmail, text, file } = JSON.parse(message);
      let fileURL = "",
        filePath = "";

      if (file) {
        const parts = file.info.name.split(".");
        const ext = parts[parts.length - 1];
        const fileName = Date.now() + "." + ext;
        fileURL += path.join("getImg", fileName).replace(/\\/g, "/");
        filePath += path.join("uploads", fileName).replace(/\\/g, "/");
        const pathName = path.join(__dirname, "uploads", fileName);
        const bufferData = Buffer.from(
          file.data.split(";base64,").pop(),
          "base64"
        );
        fs.writeFile(pathName, bufferData, { encoding: "base64" }, () => {
          console.log("file saved");
        });
      }

      const messagesDoc = new MessagesModel({
        sender: connection.userId,
        receiver: destId,
        text: text,
        fileURL,
        filePath,
      });

      await messagesDoc.save();

      if ([...wss.clients].every((client) => client.userId !== destId)) {
        //console.log(`Client ${destEmail} is offline`);
      } else {
        [...wss.clients]
          .find((client) => {
            return client.userId === destId;
          })
          .send(JSON.stringify({ text, sender: connection.userId, fileURL }));
      }
    } catch (error) {
      console.log(error);
    }
  });

  connection.on("close", (e) => {
    if (e === 1001) {
      //console.log(`User ${connection.userEmail} refreshes browser`);
    }

    if (e === 3333) {
      //console.log(`User ${connection.userEmail} logged out`);
    }
  });

  notifyAboutOnlinePeople();
});

wss.on("close", () => {
  clearInterval(interval);
});
