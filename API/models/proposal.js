const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proposalSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  // TODO
});

proposalSchema.statics.addProposal = async function (proposalData) {
  const proposal = new this(proposalData);
  await proposal.save();

  await mongoose
    .model("Client")
    .updateOne(
      { _id: proposal.client },
      { $addToSet: { proposals: proposal._id } }
    );

  return proposal;
};

module.exports = mongoose.model("Proposal", proposalSchema);
