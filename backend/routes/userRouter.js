//Library Imports
import { Router } from "express";

//Service layer functions
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
  verifyUser,
} from "../services/userService.js";
import {
  createList,
  getUserLists,
  deleteList,
} from "../services/listService.js";
import { getAllGamesByUserId, deleteGame } from "../services/gameService.js";

//Additional Utils
import { AuthenticateUser } from "./userAuth.js";
import { generateJWT } from "../utils/jwtUtils.js";
import { handleUserRequest } from "./routeUtil.js";

const router = Router();

//use to sign up a new user
router.post("/signup", async (req, res) => {
  console.log("USER POST /signup with body: ", req.body);
  try {
    const { username, password } = req.body;
    //check if there is already a user with the same username
    const existingUser = await getUser(username);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }
    //Create user and default lists
    const newUserID = await createUser(username, password);
    await createList(newUserID, "Favorites");
    await createList(newUserID, "Wishlist");
    await createList(newUserID, "Owned");

    const token = generateJWT(newUserID);
    console.log("User created successfully with userID: ", newUserID);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
});

//use to login an existing user
router.post("/login", async (req, res) => {
  console.log("USER POST /login with body: ", req.body);
  try {
    const { username, password } = req.body;
    //TODO: hash the password with its corresponding salt before comparing with the database record
    const matchingUser = await verifyUser(username, password);
    console.log("/login: matchingUser: ", matchingUser);
    if (!matchingUser) {
      console.log("No matching credentials found");
      return res.status(404).json({
        success: false,
        message: "No matching credentials found",
      });
    }
    const token = generateJWT(matchingUser.userID);
    return res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await getUsers().toArray();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

//get a user's info
router.get("/me", async (req, res) => {
  console.log("USER GET /me request received!");
  const user = await AuthenticateUser(req, res);
  if (!user) return;
  res.status(200).json({ user: user });
});

//delete a user's account
router.delete("/me", async (req, res) => {
  console.log("USER DELETE /me request received!");
  return handleUserRequest(req, res, async (user) => {
    //delete any lists made by the user
    const userLists = await getUserLists(user.userID);
    if (userLists && userLists.length > 0) {
      userLists.forEach(async (list) => {
        console.log("List: ", list);
        await deleteList(list.listID);
      });
    }
    //delete any games made by the user
    const userGames = await getAllGamesByUserId(user.userID);
    if (userGames && userGames.length > 0) {
      userGames.forEach(async (game) => {
        await deleteGame(game.id);
      });
    }
    await deleteUser(user.userID);
    return res
      .status(200)
      .json({ success: true, message: "user deleted successfully" });
  });
});

router.patch("/me", async (req, res) => {
  console.log("USER PATCH /me request received!");
  return handleUserRequest(req, res, async (user) => {
    //read updated parameters
    const { username, profile_banner_phrase, profile_picture_url } = req.body;
    if (!profile_banner_phrase || profile_banner_phrase.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Profile phrase cannot be empty" });
    }
    if (!username || username.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "username cannot be empty" });
    }

    //update the user's profile phrase
    await updateUser(user.userID, {
      profile_banner_phrase: profile_banner_phrase,
      username: username,
      profile_picture_url: profile_picture_url,
    });
    res.status(200).json({ success: true, message: "user updated!" });
  });
});

router.get("/:userID/games", async (req, res) => {
  const userID = parseInt(req.params.userID);
  if (Number.isNaN(userID)) {
    return res.status(400).json({ success: false, message: "Invalid userID" });
  }

  try {
    const games = await getAllGamesByUserId(userID);
    return res.status(200).json({ success: true, games });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:userID", async (req, res) => {
  const userID = parseInt(req.params.userID);
  try {
    const user = await getUser(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
