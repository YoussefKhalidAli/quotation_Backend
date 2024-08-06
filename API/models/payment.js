const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    service: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.statics.addPayment = async function (paymentData) {
  const payment = new this(paymentData);
  await payment.save();

  await mongoose
    .model("Client")
    .updateOne(
      { _id: payment.client },
      { $addToSet: { payments: payment._id } },
      { new: true, useFindAndModify: false }
    );

  return payment;
};

module.exports = mongoose.model("Payment", paymentSchema);
