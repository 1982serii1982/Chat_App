import express from "express";

import { checkToken } from "../utils/checkAuth.js";
import * as AuthController from "./../controllers/AuthController.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", checkToken, AuthController.logout);
router.get("/getMe", checkToken, AuthController.getMe);

export default router;
