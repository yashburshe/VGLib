import { Router } from "express";
import {
  deleteGame,
  getGameFromGameId,
  getGames,
  updateGame,
} from "../services/gameService";
import { AuthenticateUser, DecodeUserID } from "./userAuth";

const gamesRouter = Router();

gamesRouter.post("/", async (req, res) => {
  const user = await AuthenticateUser(req, res);
  if (!user) {
    return;
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
  const user = AuthenticateUser(req, res);

  if (!user) return;

  const gameId = req.params.gameId;

  const game = getGameFromGameId(gameId);
  const userId = DecodeUserID(req, res);
  if (game.userId !== userId) {
    return res
      .status(400)
      .message({ success: false, message: "Unauthorized delete" });
  }

  try {
    deleteGame(gameId);
    return res.status(200).json({ success: true, message: "Game deleted" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
});

export default gamesRouter;
