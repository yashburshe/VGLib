import { Router } from "express";
import {
  createGame,
  deleteGame,
  getAllPlatforms,
  getGameFromGameId,
  getGames,
  getGamesSortedByPopularity,
  searchGamesByText,
  updateGame,
} from "../services/gameService.js";
import { AuthenticateUser, DecodeUserID } from "./userAuth.js";

const gamesRouter = Router();

gamesRouter.post("/", async (req, res) => {
  const user = await AuthenticateUser(req, res);
  if (!user) {
    return;
  }

  console.log("here")
  try {
    const { game } = req.body;

    if (!game || !game.name || game.name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Game name is required" });
    }

    if(game.url === "") {
      game.url = "https://placehold.net/600x800.png"
    }

    const normalizedPlatforms = Array.isArray(game.platforms)
      ? game.platforms
      : typeof game.platforms === "string"
        ? game.platforms
            .split(",")
            .map((platform) => platform.trim())
            .filter((platform) => platform.length > 0)
        : [];

    const normalizedGame = {
      ...game,
      name: game.name.trim(),
      summary: game.summary ? game.summary.trim() : "",
      rating: Number.isFinite(Number(game.rating)) ? Number(game.rating) : 0,
      platforms: normalizedPlatforms,
      cover_url: game.url
    };

    const newGameId = await createGame(user.userID, normalizedGame);
    const createdGame = await getGameFromGameId(newGameId);

    return res.status(201).json({
      success: true,
      gameID: newGameId,
      game: createdGame,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

gamesRouter.get("/top", async (req, res) => {
  try {
    const topGames = await getGamesSortedByPopularity();

    if (topGames) {
      return res.status(200).json({ success: true, topGames: topGames });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No games found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

gamesRouter.get("/search", async (req, res) => {
  try {
    const { q, limit, platform, sort } = req.query;
    const results = await searchGamesByText(q, limit, platform, sort);
    return res.status(200).json({ success: true, games: results });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

gamesRouter.get("/search/platforms", async (req, res) => {
  try {
    const { q } = req.query;
    const platforms = await getAllPlatforms(q);
    return res.status(200).json({ success: true, platforms });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

gamesRouter.get("/:gameId", async (req, res) => {
  try {
    const game = await getGameFromGameId(req.params.gameId);
    if (game) {
      return res.status(200).json({ success: true, game: game });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Game not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

gamesRouter.get("/", async (req, res) => {
  try {
    const games = await getGames();
    if (games) {
      return res.status(200).json({ success: true, games: games });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "No games found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

gamesRouter.patch("/:gameId", async (req, res) => {
  const user = AuthenticateUser(req, res);

  if (!user) return;

  const gameId = req.params.gameId;

  if (!getGameFromGameId(gameId)) {
    return res.status(404).json({ success: false, message: "Game not found" });
  }

  const game = req.body.game;

  try {
    updateGame(game);
    return res.status(200).json({ success: true, message: "Game updated" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

gamesRouter.delete("/:gameId", async (req, res) => {
  const user = await AuthenticateUser(req, res);

  if (!user) return;

  const gameId = Number(req.params.gameId);

  const game = await getGameFromGameId(gameId);
  if (!game) {
    return res.status(404).json({ success: false, message: "Game not found" });
  }

  const userId = Number(user.userID ?? DecodeUserID(req, res));
  if (game.userId !== userId) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized delete" });
  }

  try {
    await deleteGame(gameId);
    return res.status(200).json({ success: true, message: "Game deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default gamesRouter;
