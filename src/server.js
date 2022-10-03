import "./config.js";
import express from "express";
import categoriesRouter from "../routes/categoriesRouter.js";
import clientsRouter from "../routes/clientsRouter.js";
import gamesRouter from "../routes/gamesRouter.js";
import rentalsRouter from "../routes/rentalsRouter.js";

const server = express();
server.use(express.json());

server.use(categoriesRouter);
server.use(gamesRouter);
server.use(clientsRouter);
server.use(rentalsRouter);

server.listen(4000, () => {
  console.log("Server is listening on port 4000.");
});
