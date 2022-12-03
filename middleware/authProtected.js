import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export async function authProtected(req, res) {
  return await unstable_getServerSession(req, res, authOptions);
}
