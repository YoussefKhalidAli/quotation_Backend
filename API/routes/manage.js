const express = require("express");
const router = express.Router();

const upload = require("../middleWare/multer");
const Client = require("../models/client");
const Feedback = require("../models/feedback");
const Agreement = require("../models/agreement");

router.post("/client", upload.single("logo"), async (req, res) => {
  try {
    const {
      name,
      phone,
      business,
      businessEmail,
      email,
      payments,
      invoices,
      services,
    } = req.body;

    const logo = req.file ? req.file.filename : "";

    const clientData = {
      name,
      phone,
      business,
      businessEmail,
      email,
      payments: Array.isArray(payments) ? payments : [],
      invoices: Array.isArray(invoices) ? invoices : [],
      services: Array.isArray(services) ? services : [],
      feedback: [],
      quotes: [],
      proposals: [],
      logo,
    };

    const client = new Client(clientData);
    await client.save();

    res.status(200).json("Saved successfully");
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
});

router.put("/client/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const { field, value } = req.body;

    const allowedFields = ["invoices", "services", "payments"];
    if (!allowedFields.includes(field)) {
      return res.status(400).json({ message: "Invalid field specified" });
    }

    const update = { $addToSet: { [field]: value } };

    const client = await Client.updateOne({ _id: clientId }, update);

    if (client.nModified === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: e.message });
  }
});

router.post("/feedback", async (req, res) => {
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

router.post("/agreement", async (req, res) => {
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
