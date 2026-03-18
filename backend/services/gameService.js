import { COLLECTIONS, db } from "../db/mongo.js";

export async function getGameFromGameId(gameId) {
  return await db.collection(COLLECTIONS.VIDEOGAMES).findOne({ id: Number(gameId) });
}

export async function getGames() {
  return await db.collection(COLLECTIONS.VIDEOGAMES).find({}).toArray();
}

export async function getGamesSortedByPopularity() {
  return await db.collection(COLLECTIONS.VIDEOGAMES).aggregate([
    {
      $lookup: {
        from: COLLECTIONS.LISTS,
        localField: "id",
        foreignField: "games",
        as: "occurrences"
      }
    },
    {
      $addFields: {
        listCount: { $size: "$occurrences" }
      }
    },
    { $sort: { listCount: -1, name: 1 } },
    { $project: { occurrences: 0 } }
  ]).toArray();
}

export async function createGame(userId, game) {
  const lastGameId = await db
    .collection(COLLECTIONS.VIDEOGAMES)
    .find()
    .sort({ id: -1 })
    .limit(1)
    .toArray();

  const nextGameId = lastGameId.length > 0 ? lastGameId[0].id + 1 : 1;

  const gameCreated = await db.collection(COLLECTIONS.VIDEOGAMES).insertOne({
    id: nextGameId,
    createAt: new Date().toISOString(),
    name: game.name,
    platforms: game.platforms,
    rating: game.rating,
    slug: game.slug,
    summary: game.summary,
    userId: userId,
  });

  if (!gameCreated || !gameCreated.acknowledged) {
    throw new Error("Failed to create game");
  }

  return nextGameId;
}

export async function deleteGame(gameId) {
  const deleteResult = await db
    .collection(COLLECTIONS.VIDEOGAMES)
    .deleteOne({ id: gameId });

  if (!deleteResult || deleteResult.deletedCount === 0) {
    throw new Error("Game not found");
  }
  return;
}

export async function updateGame(game) {
  const gameUpdated = await db.collection(COLLECTIONS.VIDEOGAMES).updateOne(
    {
      id: game.id,
    },
    {
      $set: {
        createAt: new Date().toISOString(),
        name: game.name,
        platforms: game.platforms,
        rating: game.rating,
        slug: game.slug,
        summary: game.summary,
      },
    },
  );

  if (!gameUpdated || !gameUpdated.acknowledged) {
    throw new Error("Failed to create game");
  }

  return;
}

export async function getAllGamesByUserId(userId) {
  return await db.collection(COLLECTIONS.VIDEOGAMES).find({ userId: userId }).toArray();
}
