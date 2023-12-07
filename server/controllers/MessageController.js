import MessagesModel from "../models/Messages.js";
import { createError } from "../utils/error.js";

export const getAllById = async (req, res, next) => {
  try {
    const receiverId = req.params.id;
    const messages = await MessagesModel.find({
      sender: { $in: [req.userId, receiverId] },
      receiver: { $in: [req.userId, receiverId] },
    }).sort("createdAt");

    res.json(messages);
  } catch (err) {
    next(createError(500, "Access denied"));
  }
};
