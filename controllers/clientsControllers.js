import { connection } from "../database/database.js";
import clientsSchema from "../schemas/clientsSchema.js";

export async function listClients(req, res) {
  const customers = await connection.query("SELECT * FROM customers;");
  res.send(customers.rows);
}

export async function listClientsByID(req, res) {
  const id = req.params;
  const customer = await connection.query(
    "SELECT * FROM customers WHERE id = $1;",
    [id]
  );
  if (!customer.rows) {
    res.sendStatus(404);
    return;
  }
  res.send(customer.rows);
}

export async function postClients(req, res) {
  const clients = req.body;
  const validation = clientsSchema.validate(clients);
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }
  const validCpf = await connection.query(
    `SELECT * FROM customers WHERE cpf = $1;`,
    [clients.cpf]
  );
  if (!validCpf.rows) {
    res.sendStatus(409);
    return;
  }
  await connection.query(
    `INSERT INTO customers (name, phone, cpf, birthday) VALUES (${clients.name}, ${clients.phone}, ${clients.cpf}, ${clients.birthday})`
  );
  res.send(201);
}

export async function updateClients(req, res) {
  const id = req.params;
  const clients = req.body;
  const validation = clientsSchema.validate(clients);
  if (validation.error) {
    return res.status(400).send(validation.error.details[0].message);
  }
  const validCpf = await connection.query(
    `SELECT * FROM customers WHERE cpf = $1;`,
    [clients.cpf]
  );
  if (!validCpf.rows) {
    res.sendStatus(409);
    return;
  }
  await connection.query(
    `ÙPDATE customers SET name = ${clients.name}, phone = ${clients.phone}, cpf = ${clients.cpf}, birthday = ${clients.birthday} WHERE id = $1;`,
    [id]
  );
  res.send(200);
}
