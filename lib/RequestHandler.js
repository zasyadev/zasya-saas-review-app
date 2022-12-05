import prisma from "../lib/prisma";
import authProtected from "../middleware/authProtected";
import { validate } from "../middleware/validate";

export async function RequestHandler({
  req,
  res,
  callback,
  allowedMethods = [],
  protectedRoute = false,
  schemaObj = null,
}) {
  let session = {};
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
    session = await authProtected(req, res);
    if (protectedRoute) {
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
  } catch (error) {
    res.status(401).json({ message: "Api Authentication Failed", error });
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
    return callback(req, res, prisma, session?.user);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error,
    });
  }
}
