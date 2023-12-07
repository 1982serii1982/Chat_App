import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return next(createError(500, "Access denied"));
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData });
  } catch (err) {
    next(createError(500, "Access denied"));
  }
};

export const register = async (req, res, next) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const userDoc = new UserModel({
      ...req.body,
      passwordHash: hash,
    });

    const user = await userDoc.save();

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        //exp: Math.floor(Date.now() / 1000) + 5,
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET //este generat prin cmd (openssl rand -base64 32)
      //{
      //expiresIn: "30d",
      //expiresIn: 60,
      //}
    );

    res.cookie("access_token", token, { httpOnly: true }).status(201).json({
      message: "Successful created",
      userId: user._id,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return next(createError(404, "Login or password is incorrect"));
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isValidPass) {
      return next(createError(404, "Login or password is incorrect"));
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        _id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET //este generat prin cmd (openssl rand -base64 32)
      //{
      //expiresIn: "30d",
      //expiresIn: 60,
      //}
    );

    const { passwordHash, ...userData } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true, // Informatia despre aceasta https://www.cookiepro.com/knowledge/httponly-cookie/
      })
      .status(200)
      .json({
        message: "success",
        userId: user._id,
      });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  res
    .cookie("access_token", "", {
      httpOnly: true, // Informatia despre aceasta https://www.cookiepro.com/knowledge/httponly-cookie/
    })
    .json({ succes: "ok" });
};
