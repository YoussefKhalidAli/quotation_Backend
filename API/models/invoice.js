const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // TODO
});

invoiceSchema.statics.addInvoice = async function (invoiceData) {
  const invoice = new this(invoiceData);
  await invoice.save();

  await mongoose
    .model("Client")
    .updateOne(
      { _id: invoice.client },
      { $addToSet: { invoices: invoice._id } }
    );

  return invoice;
};

module.exports = mongoose.model("Invoice", invoiceSchema);
