import prisma from "../lib/prisma";
import authProtected from "../middleware/authProtected";
import { validate } from "../middleware/validate";
import { BadRequestException } from "./BadRequestExcpetion";

export async function RequestHandler({
  req,
  res,
  callback,
  allowedMethods = [],
  protectedRoute = false,
  schemaObj = null,
}) {
  if (allowedMethods.indexOf(req.method) == -1)
    return res.status(405).json({
      message: "Method Not Allowed",
    });

  if (!callback)
    return res.status(406).json({
      message: "No handler Provided",
    });

  const session = await authProtected(req, res);
  try {
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
    return await callback(req, res, prisma, session?.user);
  } catch (error) {
    if (error instanceof BadRequestException) {
      return res.status(402).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: error,
    });
  }
}
