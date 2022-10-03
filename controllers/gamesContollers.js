import { connection } from "../database/database.js";
import gamesSchema from "../schemas/gamesSchema.js";

export async function listGames(req, res) {
  if (req.query.name) {
    const name = req.query.name;
    const games = await connection.query(
      "SELECT * FROM games WHERE name = $1;",
      [name]
    );
    res.send(games.rows);
    return;
  }
  const games = await connection.query("SELECT * FROM games;");
  res.send(games.rows);
}

export async function postGames(req, res) {
  const games = req.body;
  const validation = gamesSchema.validate(games);
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }
  const valid = await connection.query(
    `SELECT "categoryId" FROM categories WHERE "categoryId" = $1;`,
    [games.categoryId]
  );
  if (!valid.rows) {
    res.status(400);
    return;
  }
  const exists = await connection.query(
    `SELECT * FROM games WHERE name = $1;`,
    [games.name]
  );
  if (!exists.rows) {
    res.status(409);
    return;
  }
  await connection.query(
    `INSERT INTO GAMES (name,image,stockTotal,categoryId,pricePerDay) VALUES (${games.name},${games.image},${games.stockTotal},${games.categoryId},${games.pricePerDay});`
  );
  res.send(201);
}
