require("dotenv").config();

const express = require("express");
const app = express();

const connectdb = require("./connect");

app.use(express.json());

connectdb();

app.use(express.json({ extended: false }));

app.use("/manage", require("./API/routes/manage"));

const PORT = process.env.REACT_APP_PORT || 4000;

app.listen(PORT, () => console.log(PORT));
