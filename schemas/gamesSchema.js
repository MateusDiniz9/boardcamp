import Joi from "joi";

const gamesSchema = Joi.object({
  name: Joi.string().min(1).required().trim(),
  image: Joi.string().uri(),
  stockTotal: Joi.number().required().positive(),
  categoryID: Joi.number().required().positive(),
  pricePerDay: Joi.number().required(),
});

export default gamesSchema;
