const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
app.use(cors());

const connString =
  "mongodb+srv://admin:admin@cluster.nkyj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(connString);
mongoose.connection.once("open", () => {
  console.log("connected bro");
});

app.use(bodyParser.json());

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: String,
  name: String,
  email: String,
  location: String | null,
  artists: [String],
});

const User = mongoose.model("user", userSchema);

const bitcoinSchema = new Schema({
  date: String,
  eurRate: String,
  gbpRate: String,
  usdRate: String,
});

const Bitcoin = mongoose.model("bitcoin", bitcoinSchema);

app.listen(5000, () => {
  console.log("listening bro");
});

app.get("/", (req, res) => {
  res.send("Hello wlrd");
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const newUser = new User({
    id: req.body.id.toString(),
    name: req.body.name,
    email: req.body.email,
    location: null,
    artists: [],
  });
  const user = await User.findOne({ id: newUser.id });
  if (user) {
    res.send(JSON.stringify(user));
  } else {
    newUser.save();
    res.send("ok");
  }
});

app.get("/user/:id", async (req, res) => {
  const userm = await User.findOne({ id: req.params.id });
  res.send(JSON.stringify(userm));
});

app.put("/userFavourites/:id", async (req, res) => {
  console.log(req.body);
  if (req.body.action == "add") {
    console.log("dodajem");
    await User.findOneAndUpdate(
      { if: req.params.id },
      { $addToSet: { artists: req.body.name } }
    );
  } else {
    console.log("removeam");
    await User.findOneAndUpdate(
      { id: req.params.id },
      { $pull: { artists: req.body.name } }
    );
  }
  res.send("ok");
});

app.put("/userLocation/:id", async (req, res) => {
  console.log(req.body.location);
  await User.findOneAndUpdate(
    { id: req.params.id },
    { $set: { location: req.body.location } }
  );
  res.send("ok");
});

app.put("/bitcoinValue", async (req, res) => {
  console.log(req.body.bitcoinValue);
  const newBitcoin = new Bitcoin({
    date: req.body.bitcoinValue.updated,
    eurRate: req.body.bitcoinValue.eurRate,
    gbpRate: req.body.bitcoinValue.gbpRate,
    usdRate: req.body.bitcoinValue.usdRate,
  });
  const exists = await Bitcoin.findOne({
    date: req.body.bitcoinValue.updated,
  });
  if (!exists) {
    console.log("ok");
    await newBitcoin.save();
  }
  res.send("vec postoji za ovaj date");
});

app.get("/bitcoinValue", async (req, res) => {
  const lastTwoEntries = await Bitcoin.find().sort({ _id: -1 }).limit(2);
  res.send(JSON.stringify(lastTwoEntries));
});
