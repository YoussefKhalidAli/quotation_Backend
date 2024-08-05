const express = require("express");
const router = express.Router();

const Service = require("../models/service");
const auth = require("../middleWare/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { type, cost } = req.body;
    const service = new Service({ type, cost });

    await service.save();

    res.status(200).json("Saved successfully");
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
});

module.exports = router;
