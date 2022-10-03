import { connection } from "../database/database.js";
import rentalsSchema from "../schemas/rentalsSchema.js";
import dayjs from "dayjs";

export async function listRentals(req, res) {
  if (req.query.customerId) {
    const customerRentals = await connection.query(
      `SELECT * FROM rentals WHERE "customerId" = $1;`,
      [req.query.customerId]
    );
    res.send(customerRentals.rows);
    return;
  }
  if (req.query.gameId) {
    const gameRentals = await connection.query(
      `SELECT * FROM rentals WHERE "gameId" = $1;`,
      [req.query.gameId]
    );
    res.send(gameRentals.rows);
    return;
  }
  const rentals = await connection.query(`SELECT 
  rentals.*,customers.id, customers.name,games.id,games.name,games."categoryId",games."categoryName"
   from rentals 
   JOIN customers ON rentals."customerId" = custumers.id 
   JOIN games ON rentals."gameId" = games.id;`);
  res.send(rentals.rows);
}

export async function postRentals(req, res) {
  const rental = req.body;
  const validation = rentalsSchema.validate(rental);
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }
  const customerExists = await connection.query(
    "SELECT * FROM customers WHERE id = $1;",
    [rental.customerId]
  );
  if (!customerExists.rows) {
    res.sendStatus(400);
    return;
  }
  const gameExists = await connection.query(
    "SELECT * FROM games WHERE id = $1;",
    [rental.gameId]
  );
  if (!gameExists.rows) {
    res.sendStatus(400);
    return;
  }
  const stock = await connection.query(
    `SELECT "stockTotal" FROM games WHERE id = $1;`,
    [rental.gameId]
  );
  const hasGameYet = await connection.query(
    `SELECT id FROM rentals WHERE "gameId" = ${rental.gameId};`
  );

  if (stock.rows < hasGameYet.rows.length) {
    res.sendStatus(400);
    return;
  }

  const pricePerDay = await connection.query(
    `SELECT "pricePerDay" FROM games WHERE id = $1;`,
    [rental.gameId]
  );
  const price = rental.daysRented * pricePerDay.rows[0];
  rental = {
    ...rental,
    rentDate: dayjs.format("YYYY/MM/DD"),
    originalPrice: price,
    returnDate: null,
    delayFee: null,
  };
}

export async function finishRental(req, res) {
  const id = req.params;
  const rentalExists = await connection.query(
    `SELECT * FROM rentals WHERE id = $1;`,
    [id]
  );
  if (!rentalExists) {
    res.sendStatus(404);
    return;
  }
  const alreadyFinish = await connection.query(
    `SELECT "returnDate" FROM rentals WHERE id = $1;`,
    [id]
  );
  if (alreadyFinish.rows[0] !== null) {
    res.sendStatus(400);
    return;
  }
  const dayRent = await connection.query(
    `SELECT "rentDate" FROM rentals WHERE id = $1;`,
    [id]
  );
  const daysRented = await connection.query(
    `SELECT "daysRented" FROM rentals WHERE id = $1;`,
    [id]
  );
  const diference = dayRent.rows[0].diff(dayjs(), "day") - daysRented.rows[0];
  const price = 0;
  if (diference > 0) {
    const gameFee = await connection.query(
      `SELECT "pricePerDay FROM games WHERE id = $1";`,
      [rentalExists.rows[0].gameId]
    );
    price = gameFee.rows[0] * diference;
  }
  const diffDays = await connection.query(
    `UPDATE rentals SET "returnDate" = ${dayjs()}, "delayFee" = ${price} WHERE id = $1;`,
    [id]
  );

  res.send(200);
}

export async function deleteRental(req, res) {
  const id = req.params;
  const rentalExists = await connection.query(
    `SELECT * FROM rentals WHERE id = $1;`,
    [id]
  );
  if (!rentalExists) {
    res.sendStatus(404);
    return;
  }
  const alreadyFinish = await connection.query(
    `SELECT "returnDate" FROM rentals WHERE id = $1;`,
    [id]
  );
  if (alreadyFinish.rows[0] !== null) {
    res.sendStatus(400);
    return;
  }

  await connection.query(`DELETE FROM rentals WHERE id = $1;`, [id]);
  res.sendStatus(200);
}
