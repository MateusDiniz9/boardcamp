import express from "express";
import {
  listClients,
  listClientsByID,
  postClients,
  updateClients,
} from "../controllers/clientsControllers.js";

const clientsRouter = express.Router();

clientsRouter.get("/customers", listClients);
clientsRouter.get("/customers/:id", listClientsByID);
clientsRouter.post("/customers", postClients);
clientsRouter.put("/customers/:id", updateClients);

export default clientsRouter;
