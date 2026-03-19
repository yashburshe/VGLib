import { Router } from "express";

import { db, COLLECTIONS } from "../db/mongo.js";
import {
  createList,
  deleteList,
  getList,
  toggleListItem,
  getUserLists,
} from "../services/listService.js";
import { handleUserRequest, handleGenRequest } from "./routeUtil.js";

const router = Router();

//create a new custom list
router.post("/", async (req, res) => {
  console.log("POST /api/list REQ with body: ", req.body);
  return handleUserRequest(req, res, async (user) => {
    const { listName } = req.body;
    const existingList = await db
      .collection(COLLECTIONS.LISTS)
      .findOne({ user: user.userID, name: listName });
    if (existingList) {
      return res.status(400).json({
        success: false,
        message: `list: ${listName} already exists for user ${user.urserID}`,
      });
    }
    createList(user.userID, listName);
    return res.status(200).json({
      success: true,
      message: `list: ${listName} successfully added for user ${user.userID}`,
    });
  });
});

router.get("/userlists", async (req, res) => {
  console.log("GET /listByUser request received!");
  return handleUserRequest(req, res, async (user) => {
    const lists = await getUserLists(user.userID);
    if (lists) {
      return res.status(200).json({ success: true, lists: lists });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No lists found for this user!" });
    }
  });
});

router.get("/:listID", async (req, res) => {
  console.log("GET /:listID with ListID: ", req.params.listID);
  return handleGenRequest(req, res, async () => {
    const list = await getList(Number(req.params.listID));
    if (list) {
      return res.status(200).json({ success: true, list: list });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "List not found!" });
    }
  });
});

router.delete("/:listID", async (req, res) => {
  console.log("DELETE /list request received! ListID: ", req.params.listID);
  return handleUserRequest(req, res, async (user) => {
    await deleteList(Number(req.params.listID));
    return res
      .status(200)
      .json({ success: true, message: "deletion success!" });
  });
});

router.patch("/:listID", async (req, res) => {
  console.log("PATCH /list request received! ListID: ", req.params.listID);
  return handleUserRequest(req, res, async (user) => {
    const { gameID } = req.body;
    const listID = Number(req.params.listID);

    const result = await toggleListItem(listID, gameID);
    console.log(result);
    return res.status(200).json({ success: true, message: result.action });
  });
});

export default router;