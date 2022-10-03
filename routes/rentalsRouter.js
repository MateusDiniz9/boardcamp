import express from "express";
import {
  listRentals,
  postRentals,
  finishRental,
  deleteRental,
} from "../controllers/rentalsControllers.js";

const rentalsRouter = express.Router();

rentalsRouter.get("/rentals", listRentals);

rentalsRouter.post("/rentals", postRentals);

rentalsRouter.post("/rentals/:id/return", finishRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;
