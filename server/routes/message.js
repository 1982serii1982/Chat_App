import express from "express";

import { checkToken } from "../utils/checkAuth.js";
import * as MessageController from "./../controllers/MessageController.js";

const router = express.Router();

router.get("/all/:id", checkToken, MessageController.getAllById);

export default router;
