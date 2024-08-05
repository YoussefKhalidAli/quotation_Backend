const express = require("express");
const router = express.Router();

const auth = require("../middleWare/auth");

const Agreement = require("../models/agreement");

router.post("/agreement", auth, async (req, res) => {
  try {
    const {
      number,
      date,
      customer,
      overview,
      commitments,
      policy,
      services,
      items,
      terms,
      scope,
    } = req.body;

    const agreementData = {
      number,
      date,
      customer,
      overview,
      commitments,
      services,
      items,
      policy,
      terms,
      scope,
    };

    await Agreement.addAgreement(agreementData);

    res.status(200).json("Saved successfully");
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
});

module.exports = router;
