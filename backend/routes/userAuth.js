import { verifyJWT } from "../utils/jwtUtils.js";
import { getUser } from "../services/userService.js";

//Read a token from the logged in user and get their corresponding user record.
export function DecodeUserID(req, res) {
  //check for auth header existence
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Missing Token" });
    return null;
  }
  //decode the token
  const token = authHeader.split(" ")[1];
  const userID = verifyJWT(token);
  if (!userID) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    console.error("Rejected user for unverifiable token: ", token);
    return null;
  }
  return userID.userID;
}

//Full authentication against database
export async function AuthenticateUser(req, res) {
  try {
    const userID = DecodeUserID(req, res);
    if (!userID) {
      return null;
    }
    const matchingUser = await getUser(userID);
    if (!matchingUser) {
      res.status(404).json({ success: false, message: "user not found" });
      return null;
    }
    return matchingUser;
  } catch {
    res.status(500).json({ success: false, message: "Internal server error" });
    return null;
  }
}
