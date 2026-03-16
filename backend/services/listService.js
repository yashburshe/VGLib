import {db, COLLECTIONS} from  "../db/mongo.js"

//General purpose functions to handle list collection operations

export async function createList(userID, listName) {
    //check if there is already a list associated with the user with the given name
    const existingList = await db
        .collection(COLLECTIONS.LISTS)
        .findOne({userID: userID, name: listName})
    if (existingList) {
        throw new Error('List of same name already exists for the user!');
    }

    //get the next incremented listID
    const maxListID = await db
        .collection(COLLECTIONS.LISTS)
        .find()
        .sort({ listID: -1})
        .limit(1)
        .toArray();
    const newListID = maxListID.length > 0 ? maxListID[0].listID + 1 : 1;
    const listCreated= await db
        .collection(COLLECTIONS.LISTS)
        .insertOne({
            listID: newListID,
            createAt: new Date().toISOString(),
            userID: userID,
            name: listName
        })
    if (!listCreated || !listCreated.acknowledged) {
        throw new Error("Failed to create list");
    }
    return newListID;
}

export async function deleteList(listID) {
    const deleteResult = await db
        .collection(COLLECTIONS.LISTS)
        .deleteOne({ listID: listID});
    if (!deleteResult || deleteResult.deletedCount === 0) {
        throw new Error("List not found or failed to delete");
    }
    return;
}

export async function getList(listID) {
    return await db
        .collection(COLLECTIONS.LISTS)
        .findOne({listID: listID});
}

export async function getUserLists(userID) {
    return await db
        .collection(COLLECTIONS.LISTS)
        .find({userID: userID})
        .sort({ name: 1})
        .toArray();
}

export async function addListItem(listID, newItem) {
    const updateResult = await db
        .collection(COLLECTIONS.LISTS)
        .updateOne(
            { listID: listID },
            { $addToSet: {games: newItem} }
        );
    if (!updateResult || updateResult.modifiedCount === 0) {
        throw new Error("User not found or no changes made");
    }
    return;
}

export async function changeListName(listID, newName) {
    const updateResult = await db
        .collection(COLLECTIONS.LISTS)
        .updateOne(
            { listID: listID },
            { $set: { name: newName } }
        );
    if (!updateResult || updateResult.modifiedCount === 0) {
        throw new Error("List not found or no changes made");
    }
    return;
}