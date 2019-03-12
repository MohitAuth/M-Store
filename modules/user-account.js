const mongoose = require("mongoose");
const joi = require("joi");
const accountSchema = new mongoose.Schema({
  phone: { type: Number, required: true },

  address: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  code: { type: Number, required: true }
});

var Account = mongoose.model("Account", accountSchema);

function validateAccount(account) {
  const schema = {
    phone: joi.string().required(),

    address: joi.string().required(),
    state: joi.string().required(),
    city: joi.string().required(),
    code: joi.string().required()
  };
  return joi.validate(account, schema);
}

exports.Account = Account;
exports.validate = validateAccount;
