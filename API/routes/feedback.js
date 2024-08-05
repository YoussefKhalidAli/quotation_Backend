const express = require("express");
const router = express.Router();

const Feedback = require("../models/feedback");

router.post("/", async (req, res) => {
  try {
    const { client, message, rating } = req.body;
    const feedbackData = { client, message, rating };

    await Feedback.addFeedback(feedbackData);

    res.status(200).json("Saved successfully");
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
});

module.exports = router;
