require("dotenv").config();

const express = require("express");
const app = express();

const connectdb = require("./connect");

app.use(express.json());

connectdb();

app.use(express.json({ extended: false }));

app.use("/client", require("./API/routes/client"));
app.use("/feedback", require("./API/routes/feedback"));
app.use("/user", require("./API/routes/user"));

const PORT = process.env.REACT_APP_PORT || 4000;

app.listen(PORT, () => console.log(PORT));
