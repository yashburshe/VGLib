import { Router } from 'express';
import { db, COLLECTIONS } from "../db/mongo.js";
import { AuthenticateUser } from './userAuth.js';
import { createList, deleteList, getList, addListItem, changeListName, getUserLists } from '../services/listService.js';

const router = Router();

//create a new custom list
router.post('/list', async (req, res) => {
    const user = await AuthenticateUser(req, res);
    if (!user) {
        return;
    }

    //check if there is already a list with that name
    const { listName } = req.body;
    const existingList = await db
        .collection(COLLECTIONS.LISTS)
        .findOne( { user : user.userID, name: listName})
    if (existingList) {
        return res
            .status(400)
            .json({success: false, message: "List with same name already exists for this user!"})
    }
    
    createList(user.userID, listName);
});

router.get('/:listID', async (req, res) => {
    //authenticate user
    const user = AuthenticateUser(req, res);
    if (!user) return; 

    try {
        const list =  await getList(req.params.listID);
        if (list) {
            return res.status(200).json({success: true, list: list});
        } else {
            return res.status(404).json({success: false, message: "List not found!"});
        }
    } catch (error) {
        return res.status(500).json({message: error});
    }
});

router.delete('/:listID', async (req, res) => {
    //authenticate user
    const user = AuthenticateUser(req, res);
    if (!user) return;
    //check if there is a list (which matches the authenticated user)
    try {
        await deleteList(req.params.listID);
        return res.status(200).json({success: true, message: "deletion success!"});
    } catch (error) {
        
    }
});

//TODO: allow user to add/remove items from the list, and update the list name
router.patch('/:listID', async (req, res) => {
    //authenticate user
    const user = authenticateUser(req, res);
    if (!user) return;
    //check and update a list which matches the authenticated user
    const listID = req.params.listID;
    //read any additional items to add to the games list
    const { itemID } = req.body;
    try {
        addListItem(listID, itemID);
        return res.status(200).json({success: true, message: "Item added to list!"});
    } catch (error) {
        return res.status(500).json({message: error});
    }
});

export default router;