const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Agreement = require("../models/agreement");
const Payment = require("../models/payment");
const Feedback = require("../models/feedback");
const Invoice = require("../models/invoice");
const Proposal = require("../models/proposal");

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
  invoices: {
    type: [{ type: Schema.Types.ObjectId, required: true, ref: "Invoice" }],
    required: true,
  },
  services: {
    type: [{ type: Schema.Types.ObjectId, required: true, ref: "Service" }],
    required: true,
  },
  proposals: {
    type: [{ type: Schema.Types.ObjectId, required: true, ref: "Proposal" }],
    required: true,
  },
  agreements: {
    type: [{ type: Schema.Types.ObjectId, required: true, ref: "Agreement" }],
    required: true,
  },
  feedback: {
    type: [{ type: Schema.Types.ObjectId, required: true, ref: "Feedback" }],
  },
  payments: {
    type: [{ type: Schema.Types.ObjectId, required: true, ref: "Payment" }],
  },
});

clientSchema.index(
  { businessEmail: 1 },
  {
    unique: true,
    partialFilterExpression: { businessEmail: { $exists: true, $ne: null } },
  }
);

clientSchema.statics.removeDependents = async function (clientId) {
  try {
    await Agreement.deleteMany({ client: clientId });
    await Feedback.deleteMany({ client: clientId });
    await Invoice.deleteMany({ client: clientId });
    await Proposal.deleteMany({ client: clientId });
    await Payment.deleteMany({ client: clientId });
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model("Client", clientSchema);
