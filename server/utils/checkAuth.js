import jwt from "jsonwebtoken";

import { createError } from "./error.js";

export const checkToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded._id;
      next();
    } catch (err) {
      return next(createError(403, "Forbidden access"));
      // return res.status(403).json({
      //   err,
      // });
    }
  } else {
    // return res.status(403).json({
    //   message: "token missing",
    // });
    return next(createError(403, "Forbidden access"));
  }
};
