const express = require("express");
const router = express.Router();

const Payment = require("../models/payment");
const auth = require("../middleWare/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { client, amount } = req.body;
    const paymentData = { client, amount };

    await Payment.addPayment(paymentData);

    res.status(200).json("Saved successfully");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
