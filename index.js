const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const user = require("./routes/userRoutes");
const admin = require("./routes/adminRoutes");
const db = require("./model/connection");
const BodyParser = require("body-parser");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", user);
app.use("/admin", admin);

db.connect();
app.listen(process.env.PORT, () => {
  console.log("port connected");
});
