const express = require("express");
const router = express.Router();

const upload = require("../middleWare/multer");
const Client = require("../models/client");

router.post("/", upload.single("logo"), async (req, res) => {
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

router.put("/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;
    const { value } = req.body;

    const update = { $addToSet: { services: value } };

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

router.delete("/:clientId", auth, async (req, res) => {
  try {
    Client.deleteOne({ _id: req.params.clientId });

    res.json("success");
  } catch (err) {
    res.json(err.message);
  }
});

module.exports = router;
