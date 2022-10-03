import express from "express";
import {
  listCategories,
  postCategories,
} from "../controllers/categoriesControllers.js";

const categoriesRouter = express.Router();

categoriesRouter.get("/categories", listCategories);
categoriesRouter.post("/categories", postCategories);

export default categoriesRouter;
