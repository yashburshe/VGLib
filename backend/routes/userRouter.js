import { Router } from 'express';
import { getDB} from "../db/mongo.js";
import { generateJWT, verifyJWT } from '../utils/jwt.js';

const router = Router();
const USER_COLLECTION = "users";

//use to sign up a new user
router.post('/signup', async (req, res) => {
    try {
        const { username, passwordHash } = req.body;
        const db = await getDB();
        
        //check if there is already a user with the same username
        const existingUser = await db
            .collection(USER_COLLECTION)
            .findOne({ username });
        if (existingUser) {
            return res
                .status(400)
                .json({ message: 'Username already exists' });
        }

        //otherwise insert the user into the database
        const dbResult = await db
            .collection('users')
            .insertOne({ username, passwordHash });
        print(dbResult)
        const userID = 1; //TODO: read userID from dbResult
        const token = generateJWT(userID);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
});

//use to login an existing user
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = await getDB();
        const matchingUser = await db
            .collection(USER_COLLECTION)
            .findOne({ username});
        print(matchingUser)
        const userID = 1; //TODO: read userID from dbResult
        const token = generateJWT(userID);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
});

//get a user's info
router.get('/me', async (req, res) => {
    try {
        //check for auth header existence
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401)
                .json({success: false, message: "missing token"});
        }

        //check auth token validity
        const token = authHeader.split(" ")[1];
        const decoded = verifyJWT(token);
        if (!decoded) {
            return res.status(401)
                .json({success: false, message: "invalid token"});
        }

        const db = await getDB();
        const matchingUser = await db
            .collection(USER_COLLECTION)
            .findOne(
                {userId: decoded.userId},                          //define query
                {projection: { _id: 0, username: 1, password: 0}}, //define fields to return
            );
        if (!matchingUser) {
            return res.status(404)
                .json({success: false, message: "user not found"});
        }
        res.status(200)
            .json({success: true, user: matchingUser});

    } catch (error) {
        res.status(500)
            .json({ success: false, message: "Internal server error"});
    }
});

//delete a user's account
router.delete('/delete', async (req, res) => {
    try {
        //check for auth header existence
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401)
                .json({success: false, message: "missing token"});
        }

        //check auth token validity
        const token = authHeader.split(" ")[1];
        const decoded = verifyJWT(token);
        if (!decoded) {
            return res.status(401)
                .json({success: false, message: "invalid token"});
        }

        //TODO: delete user's associated records
        const db = await getDB();
        const deleteResult = await db
            .collection(USER_COLLECTION)
            .deleteOne({userId: decoded.userId});
        if (result.deletedCount === 1) {
            res.status(200)
                .json({success: true, message: "user deleted successfully"});
        }
        else if (!result) {
            return res.status(404)
                .json({success: false, message: "Internal server error"});
        }
        res.status(200)
            .json({success: true, user: matchingUser});

    } catch (error) {
        res.status(500)
            .json({ success: false, message: "Internal server error"});
    }
});

router.patch('/me', async (req, res) => {
    try {
        //check for auth header existence
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401)
                .json({success: false, message: "missing token"});
        }

        //check auth token validity
        const token = authHeader.split(" ")[1];
        const decoded = verifyJWT(token);
        if (!decoded) {
            return res.status(401)
                .json({success: false, message: "invalid token"});
        }

        //read updated parameters
        const { firstName } = req.body;
        if (!firstName || firstName.trim() === "") {
            return res.status(400)
                .json({ success: false, message: "Name cannot be empty" });
        }

        const db = await getDB();
        const deleteResult = await db
            .collection(USER_COLLECTION)
            .updateOne(
                {userId: decoded.userId},     //define query
                {$set: {firstName: firstName}}, //define update operations
            );
        if (!matchingUser) {
            return res.status(404)
                .json({success: false, message: "user not found"});
        }
        res.status(200).json({success: true, user: matchingUser});

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error"});
    }
});

export default router;