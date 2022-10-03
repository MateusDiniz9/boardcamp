import Joi from "joi";
import JoiDate from "@joi/date";

const newJoi = Joi.extend(JoiDate);

const clientsSchema = newJoi.object({
  name: newJoi.string().min(1).required().trim(),
  phone: newJoi.string().min(10).max(11).trim().required(),
  cpf: newJoi.string().min(11).max(11).required(),
  birthday: newJoi.date().format("YYYY/MM/DD"),
});

export default clientsSchema;
