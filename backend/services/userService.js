import {db, COLLECTIONS } from "../db/mongo.js"
import {createList} from "./listService.js"

//General purpose functions to handle user related database operations, such as creating a new user, updating a user's info, etc. These functions are used by the userRouter to handle incoming requests, and are also used by other services (e.g. listService) to get user info when needed.

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
        .sort({ userId: -1})
        .limit(1)
        .toArray();
    const newUserID = maxUserID.length > 0 ? maxUserID[0].userID + 1 : 1;
    const userCreated = await db
        .collection(COLLECTIONS.USERS)
        .insertOne( {
            userID: newUserID,
            username: username, 
            password_hash : passwordHash
        });
    if (!userCreated || !userCreated.acknowledged) {
        throw new Error("Failed to create user");
    }

    await createList(newUserID, "Favorites");
    await createList(newUserID, "Wishlist");
    await createList(newUserID, "Owned")
    return newUserID;
}

export async function deleteUser(userID) {
    const deleteResult = await db
        .collection(COLLECTIONS.USERS)
        .deleteOne({ userID: userID});
    if (!deleteResult || deleteResult.deletedCount === 0) {
        throw new Error("User not found");
    }
    return;
}

export async function getUser(userID) {
    return await db
        .collection(COLLECTIONS.USERS)
        .findOne( 
            {userID: userID},
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
    if (!updateResult || updateResult.modifiedCount === 0) {
        throw new Error("User not found or no changes made");
    }
    return;
}