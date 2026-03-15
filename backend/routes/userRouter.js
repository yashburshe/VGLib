import { Router } from 'express';
import { db, COLLECTIONS } from "../db/mongo.js";
import { AuthenticateUser } from './userAuth.js';
import { createUser, deleteUser, getUser } from '../services/userService.js';

const router = Router();

//use to sign up a new user
router.post('/signup', async (req, res) => {
    try {     
        const { username, passwordHash } = req.body; 
        //check if there is already a user with the same username
        const existingUser = await getUser(username);
        if (existingUser) {
            return res
                .status(400)
                .json({ success: false, message: 'Username already exists' });
        }
        const newUserID = await createUser(username, passwordHash);
        const token = generateJWT(newUserID);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
});

//use to login an existing user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        //TODO: hash the password with its corresponding salt before comparing with the database record
        const matchingUser = await db
            .collection(COLLECTIONS.USERS)
            .findOne({ username, password_hash: password});
        const token = generateJWT(matchingUser.userID);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
});

//get a user's info
router.get('/me', async (req, res) => {
    console.log("Received request for user info");
    const user = await AuthenticateUser(req, res);
    if (!user) return;
    res.status(200).json({user});
});

//delete a user's account
router.delete('/delete', async (req, res) => {
    const user = await AuthenticateUser(req, res);
    if (!user) return;
    try {
        //TODO: delete user's associated records (e.g. lists, etc.)
        deleteUser(user.userID);
        return res
            .status(200)
            .json({success: true, message: "user deleted successfully"});
    } catch (error) {
        res.status(500)
            .json({ success: false, message: error.message});
    }
});

//TODO allow users to update their profile picture
router.patch('/me', async (req, res) => {
    const user = await AuthenticateUser(req, res);
    if (!user) return;
    try {
        //read updated parameters
        const { profile_phrase } = req.body;
        if (!profile_phrase || profile_phrase.trim() === "") {
            return res.status(400)
                .json({ success: false, message: "Profile phrase cannot be empty" });
        }

        //update the user's profile phrase
        await updateUser(user.userID, { profile_banner_phrase : profile_phrase });
        res.status(200).json({success: true, user: matchingUser});

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;