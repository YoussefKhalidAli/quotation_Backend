const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v); // Ensure it is a 10 digit number
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  logo: {
    type: String,
    //required: true,
  },
  business: {
    type: String,
    required: true,
    trim: true,
  },
  businessEmail: {
    type: String,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  payments: {
    type: [String],
    required: true,
  },
  invoices: {
    type: [String],
    required: true,
  },
  services: {
    type: [String],
    required: true,
  },
  proposals: {
    type: [{ type: Schema.Types.ObjectId, required: true }],
    ref: "Proposal",
    required: true,
  },
  quotes: {
    type: [{ type: Schema.Types.ObjectId, required: true }],
    ref: "Quote",
    required: true,
  },
  agreements: {
    type: [{ type: Schema.Types.ObjectId, required: true }],
    ref: "Agreement",
    required: true,
  },
  feedback: {
    type: [{ type: Schema.Types.ObjectId, required: true }],
    ref: "Feedback",
  },
});

clientSchema.index(
  { businessEmail: 1 },
  {
    unique: true,
    partialFilterExpression: { businessEmail: { $exists: true, $ne: null } },
  }
);

module.exports = mongoose.model("Client", clientSchema);
