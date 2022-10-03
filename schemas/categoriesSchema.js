import Joi from "joi";

const categoriesSchema = Joi.object({
  name: Joi.string().min(1).required().trim(),
});

export default categoriesSchema;
