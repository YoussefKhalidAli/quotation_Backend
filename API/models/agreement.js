const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dateSchema = new Schema(
  {
    start: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const itemSchema = new Schema(
  {
    item: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  { _id: false }
);

const agreementSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    date: {
      type: dateSchema,
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    commitments: {
      type: [String],
      required: true,
    },
    policy: {
      type: String,
      required: true,
    },
    services: {
      type: [String],
      required: true,
    },
    items: {
      type: [itemSchema],
      required: true,
    },
    terms: {
      type: String,
      required: true,
    },
    scope: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

agreementSchema.statics.addAgreement = async function (agreementData) {
  const agrement = new this(agreementData);
  await agrement.save();

  await mongoose
    .model("Client")
    .updateOne(
      { _id: agrement.customer },
      { $addToSet: { agreements: agrement._id } },
      { new: true, useFindAndModify: false }
    );

  return agrement;
};

module.exports = mongoose.model("Agreement", agreementSchema);
