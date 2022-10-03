import express from "express";
import { listGames, postGames } from "../controllers/gamesContollers.js";

const gamesRouter = express.Router();

gamesRouter.get("/games", listGames);
gamesRouter.post("/games", postGames);

export default gamesRouter;
