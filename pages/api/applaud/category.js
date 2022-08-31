import prisma from "../../../lib/prisma";
import { RequestHandler } from "../../../lib/RequestHandler";

async function handle(req, res) {
  if (!req.method === "GET") {
    return res.status(405).json({
      message: "Method Not allowed",
    });
  }

  const data = await prisma.applaudCategory.findMany({});

  if (data) {
    return res.status(200).json({
      status: 200,
      data: data,
      message: "Data Fetched Successfully",
    });
  } else {
    return res.status(400).json({
      status: 400,

      message: "Internal Server Error",
    });
  }
}

export default (req, res) => RequestHandler(req, res, handle, ["GET"]);
