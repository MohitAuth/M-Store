const mongoose = require("mongoose");
const joi = require("joi");
const accountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  code: { type: Number, required: true }
});

var Account = mongoose.model("Account", accountSchema);

function validateAccount(account) {
  const schema = {
      name: joi.string().required(),
      phone: joi.string().required(),
      email: joi.string().required(),
      address: joi.string().required(),
      state: joi.string().required(),
      city: joi.string().required(),
      code: joi.string().required()
  };
  return joi.validate(account,schema);
}

exports.Account = Account;
exports.validate = validateAccount;
