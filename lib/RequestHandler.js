import prisma from "../lib/prisma";
import * as yup from "yup";

export function RequestHandler(req, res, callback, allowedMethods = []) {
  if (allowedMethods.indexOf(req.method) == -1) {
    return res.status(401).json({
      status: 401,
      message: "Method Not Allowed",
    });
  }

  if (!callback) {
    return res.status(402).json({
      status: 402,
      message: "No handler Provided",
    });
  }

  try {
    return callback(req, res, prisma);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
}
