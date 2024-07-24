const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  client: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  message: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.trim().length > 0;
      },
      message: (props) => `${props.value} is not a valid feedback message`,
    },
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

feedbackSchema.statics.addFeedback = async function (feedbackData) {
  const feedback = new this(feedbackData);
  await feedback.save();

  await mongoose
    .model("Client")
    .updateOne(
      { _id: feedback.client },
      { $addToSet: { feedback: feedback._id } },
      { new: true, useFindAndModify: false }
    );

  return feedback;
};

module.exports = mongoose.model("Feedback", feedbackSchema);
