import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export default async function authProtected(req, res) {
  return await unstable_getServerSession(req, res, authOptions);
}
