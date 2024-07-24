const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proposalSchema = new Schema({});

module.exports = mongoose.model("Proposal", proposalSchema);
