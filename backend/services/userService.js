import {db, COLLECTIONS } from "../db/mongo.js"

//General purpose functions to handle user related database operations, such as creating a new user, updating a user's info, etc. These functions are used by the userRouter to handle incoming requests, and are also used by other services (e.g. listService) to get user info when needed.
export async function verifyUser(username, password) {
    return await db
        .collection(COLLECTIONS.USERS)
        .findOne({ username, password_hash: password});
}


export async function createUser(username, passwordHash) {
    //check if there is already a user with the same username
    const existingUser = await db
        .collection(COLLECTIONS.USERS)
        .findOne({ username });
    if (existingUser) {
        throw new Error('Username already exists');
    }
    //get the next incremented userID
    const maxUserID = await db
        .collection(COLLECTIONS.USERS)
        .find()
        .sort({ userID: -1})
        .limit(1)
        .toArray();
    const newUserID = maxUserID.length > 0 ? maxUserID[0].userID + 1 : 1;
    const userCreated = await db
        .collection(COLLECTIONS.USERS)
        .insertOne({
            userID: newUserID,
            username: username, 
            password_hash : passwordHash,
            createdAt: new Date().toISOString(),
            profile_banner_phrase: "This user prefers to keep an air of mystery about them.",
            profile_picture_url: "http://dummyimage.com/197x100.png/dddddd/000000"
        });
    if (!userCreated || !userCreated.acknowledged) {
        throw new Error("Failed to create user");
    }
    return newUserID;
}

export async function deleteUser(userID) {
    const deleteResult = await db
        .collection(COLLECTIONS.USERS)
        .deleteOne({ userID: userID});
    if (!deleteResult || deleteResult.deletedCount === 0) {
        throw new Error("User not found");
    }
}

export async function getUser(userID) {
    return await db
        .collection(COLLECTIONS.USERS)
        .findOne( 
            {userID: userID},
            {projection: {password_hash: 0}}
        );
}

export function getUsers() {
    console.log(`Retrieving all users`);
    return db
        .collection(COLLECTIONS.USERS)
        .find(
            {projection: {password_hash: 0}}
        );
}

export async function updateUser(userID, updatedFields) {
    const updateResult = await db
        .collection(COLLECTIONS.USERS)
        .updateOne(
            { userID: userID },
            { $set: updatedFields }
        );
    if (updateResult 
        && updateResult.modifiedCount === 1 
        && updateResult.upsertedCount === 0
    ) {
        console.log("Update Success!");
    } else {
        throw new Error("User not found or no changes made. Result: ", updateResult);
    }   
}