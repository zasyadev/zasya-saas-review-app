import prisma from "../lib/prisma";
import { validate } from "../middleware/validate";

export async function RequestHandler(
  req,
  res,
  callback,
  allowedMethods = [],
  schemaObj = null
) {
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

  if (["POST", "PUT"].includes(req.method) && schemaObj) {
    try {
      const newSchema = schemaObj[req.method];

      if (newSchema) {
        await validate(newSchema, req.body);
      }
    } catch (error) {
      return res.status(400).json(error);
    }
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
