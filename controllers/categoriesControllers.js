import { connection } from "../database/database.js";
import categoriesSchema from "../schemas/categoriesSchema.js";

export async function listCategories(req, res) {
  const categories = await connection.query("SELECT * FROM categories;");
  res.send(categories.rows);
}

export async function postCategories(req, res) {
  const categorie = req.body;
  const validation = categoriesSchema.validate(categorie);
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }
  const exists = await connection.query(
    "SELECT * FROM categories WHERE name = $1;",
    [categorie.name]
  );
  if (!exists.rows) {
    res.status(409);
    retun;
  }
  await connection.query(
    `INSERT INTO categories (name) VALUES (${categorie.name});`
  );
  res.sendStatus(201);
}
