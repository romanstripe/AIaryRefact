require("dotenv").config();

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");

const mongoURI = process.env.MONGODB_URI_PROD;
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json()); // req.body가 객체로 인식됨
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", indexRouter);
app.use(express.static(path.join(__dirname, "public"))); // public 폴더 정적 서빙

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.log("DB connection fail", err));

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
