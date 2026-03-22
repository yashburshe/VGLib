//Library Imports
import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";

//Service layer functions
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../services/userService.js";
import {
  createList,
  getUserLists,
  deleteList,
} from "../services/listService.js";
import { getAllGamesByUserId, deleteGame } from "../services/gameService.js";

//Additional Utils
import { handleGenRequest } from "./routeUtil.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = Router();

//use to sign up a new user
router.post("/signup", async (req, res) => {
  console.log("USER POST /signup with body: ", req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //check if there is already a user with the same username
    const existingUser = await getUser(username);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //Create user and default lists
    const newUserID = await createUser(username, hashedPassword);
    await createList(newUserID, "Favorites");
    await createList(newUserID, "Wishlist");
    await createList(newUserID, "Owned");

    res.status(201).json({
      success: true,
      message: "registration success",
      userID: newUserID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ message: "login success" });
});

router.get("/all", async (_, res) => {
  try {
    const users = await getUsers().toArray();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

//get a user's info
router.get("/me", isAuthenticated, (req, res) => {
  console.log("USER GET /me request received!", req.user);
  delete req.user.password_hash;
  res.json({ user: req.user });
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    } else {
      return res.json({ message: "Logout success" });
    }
  });
});

//delete a user's account
router.delete("/me", isAuthenticated, async (req, res) => {
  console.log("USER DELETE /me request received!");
  return handleGenRequest(req, res, async () => {
    //delete any lists made by the user
    const userLists = await getUserLists(req.user.userID);
    if (userLists && userLists.length > 0) {
      userLists.forEach(async (list) => {
        console.log("List: ", list);
        await deleteList(list.listID);
      });
    }
    //delete any games made by the user
    const userGames = await getAllGamesByUserId(req.user.userID);
    if (userGames && userGames.length > 0) {
      userGames.forEach(async (game) => {
        await deleteGame(game.id);
      });
    }
    await deleteUser(req.user.userID);
    return res
      .status(200)
      .json({ success: true, message: "user deleted successfully" });
  });
});

router.patch("/me", async (req, res) => {
  console.log("USER PATCH /me request received!");
  return handleGenRequest(req, res, async () => {
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
    await updateUser(req.user.userID, {
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
