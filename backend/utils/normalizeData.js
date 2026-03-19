import { db, COLLECTIONS } from "../db/mongo.js";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeIntArrayRandomLength() {
  const length = getRandomInt(0, 20);
  return Array.from({ length: length }, () => getRandomInt(1, 1000));
}

//Renormalize GameID to be according to row number
async function normalizeGames() {
  console.log("normalizing games!");
  let cursor = db.collection(COLLECTIONS.VIDEOGAMES).find();
  //iterate over each document, setting the id value to the counter value
  let counter = 1;
  while (await cursor.hasNext()) {
    const game = await cursor.next();
    await db
      .collection(COLLECTIONS.VIDEOGAMES)
      .updateOne(
        { _id: game._id },
        { $set: { id: counter } },
        { $unset: { gameID: "" } },
      );
    counter++;
  }
}

async function randomizeListItems() {
  console.log("Randomizing user lists!");
  let cursor = db.collection(COLLECTIONS.LISTS).find();
  while (await cursor.hasNext()) {
    const list = await cursor.next();
    const gameArr = makeIntArrayRandomLength();
    await db.collection(COLLECTIONS.LISTS).updateOne(
      { _id: list._id },
      //set the list json array to a random sample of 5 gameIDs from the videogames collection
      { $set: { games: gameArr } },
    );
  }
}

export { normalizeGames, randomizeListItems };