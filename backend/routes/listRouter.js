import { Router } from 'express';
import { db, COLLECTIONS } from "../db/mongo.js";
import { AuthenticateUser } from './userAuth.js';
import { createList, deleteList, getList, addListItem, changeListName, getUserLists } from '../services/listService.js';

console.log("listRouter loaded!");

const router = Router();

async function routeMethodHelper(req, res, method) {
    const user = await AuthenticateUser(req, res);
    if (!user) return;
    try {
        return method(user);
    } catch (error) {
        return res
            .status(500)
            .json({success: false, message: `Internal Server Error: ${error}`});
    }
}

//create a new custom list
router.post('/list', async (req, res) => {
    console.log("POST /list received!");
    return routeMethodHelper(req, res, async (user) => {
        const { listName } = req.body;
        const existingList = await db
            .collection(COLLECTIONS.LISTS)
            .findOne( { user : user.userID, name: listName})
        if (existingList) {
            return res
                .status(400)
                .json({success: false, message: "User can't create lists with same name!"})
        }
        createList(user.userID, listName);
    });
});

router.get('/userlists', async (req, res) => {
    console.log("GET /listByUser request received!");
    return routeMethodHelper(req, res, async (user) => {
        const lists =  await getUserLists(user.userID);
        console.log("Lists found: ", lists);
        if (lists) {
            return res.status(200).json({success: true, lists: lists});
        } else {
            return res.status(404).json({success: false, message: "No lists found for this user!"});
        }
    });
});

router.get('/:listID', async (req, res) => {
    console.log("GET /:listID with ListID: ", req.params.listID);
    return routeMethodHelper(req, res, async (user) => {
        //TODO: consider limiting view by user
        const list =  await getList(req.params.listID);
        if (list) {
            return res.status(200).json({success: true, list: list});
        } else {
            return res.status(404).json({success: false, message: "List not found!"});
        }
    });
});

router.delete('/:listID', async (req, res) => {
    console.log("DELETE /list request received! ListID: ", req.params.listID);
    return routeMethodHelper(req, res, async (user) => {
        //TODO: confirm user owns list
        await deleteList(req.params.listID);
        return res.status(200).json({success: true, message: "deletion success!"});
    });
});

//TODO: allow user to add/remove items from the list, and update the list name
router.patch('/:listID', async (req, res) => {
    console.log("PATCH /list request received! ListID: ", req.params.listID);
    return routeMethodHelper(req, res, async (user) => {
        const { gameID } = req.body;
        addListItem(req.params.listID, gameID);
        return res.status(200).json({success: true, message: "Item added to list!"});
    });
});

export default router;