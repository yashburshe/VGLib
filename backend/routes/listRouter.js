import { Router } from 'express';
import { getDB } from "../db/mongo.js";

const router = Router();
const USER_COLLECTION = "lists";


//create a new custom list
router.post('/list', async (req, res) => {
    //authenticate user

    //check if there is already a list with that name

    //create the list
});

router.get('/:listID', async (req, res) => {
    //authenticate user

    //check if there is a list (which matches the authenticated user)

    //get the list
});

router.delete('/:listID', async (req, res) => {
    //authenticate user

    //see if there is a list (which matches the authenticated user)

    //delete the list
});

router.post('/:listID', async (req, res) => {
    //authenticate user

    //check if there is a list which matches the authenticated user

    //check if the given item is valid

    //update the list with the given item
});

export default router;