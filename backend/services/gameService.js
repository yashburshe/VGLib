import { COLLECTIONS, db } from "../db/mongo.js";

export async function getGameFromGameId(gameId) {
  return await db
    .collection(COLLECTIONS.VIDEOGAMES)
    .findOne({ id: Number(gameId) });
}

export async function getGames() {
  return await db.collection(COLLECTIONS.VIDEOGAMES).find({}).toArray();
}

export async function getGamesSortedByPopularity() {
  return await db
    .collection(COLLECTIONS.VIDEOGAMES)
    .aggregate([
      {
        $lookup: {
          from: COLLECTIONS.LISTS,
          localField: "id",
          foreignField: "games",
          as: "occurrences",
        },
      },
      {
        $addFields: {
          listCount: { $size: "$occurrences" },
        },
      },
      { $sort: { listCount: -1, name: 1 } },
      { $project: { occurrences: 0 } },
    ])
    .toArray();
}

export async function searchGamesByText(
  query,
  limit = 24,
  platform = "",
  sortRating = "desc",
) {
  const safeLimit = Number.isFinite(Number(limit)) ? Number(limit) : 24;
  const text = (query || "").trim();
  const selectedPlatform = (platform || "").trim();
  const filters = [];

  if (text) {
    const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filters.push({
      $or: [
        { name: regex },
        { summary: regex },
        { platforms: { $elemMatch: { $regex: regex } } },
      ],
    });
  }

  if (selectedPlatform) {
    const platformRegex = new RegExp(
      `^${selectedPlatform.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      "i",
    );
    filters.push({ platforms: { $elemMatch: { $regex: platformRegex } } });
  }

  const sortDirection = sortRating === "asc" ? 1 : -1;
  const queryObject = filters.length > 0 ? { $and: filters } : {};

  return await db
    .collection(COLLECTIONS.VIDEOGAMES)
    .find(queryObject)
    .sort({ rating: sortDirection, name: 1 })
    .limit(safeLimit)
    .toArray();
}

export async function getAllPlatforms(query = "") {
  const text = (query || "").trim();
  const filter = text
    ? {
        $or: [
          { name: { $regex: text, $options: "i" } },
          { summary: { $regex: text, $options: "i" } },
          { platforms: { $elemMatch: { $regex: text, $options: "i" } } },
        ],
      }
    : {};

  const platforms = await db
    .collection(COLLECTIONS.VIDEOGAMES)
    .aggregate([
      { $match: filter },
      { $unwind: "$platforms" },
      {
        $match: {
          platforms: { $type: "string", $nin: [""] },
        },
      },
      {
        $group: {
          _id: "$platforms",
        },
      },
      {
        $project: {
          _id: 0,
          platform: "$_id",
        },
      },
      { $sort: { platform: 1 } },
    ])
    .toArray();

  return platforms.map((entry) => entry.platform);
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
    cover_url: game.cover_url,
    platforms: game.platforms,
    rating: game.rating,
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
        cover_url: game.cover_url,
        platforms: game.platforms,
        rating: game.rating,
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
  return await db
    .collection(COLLECTIONS.VIDEOGAMES)
    .find({ userId: userId })
    .toArray();
}