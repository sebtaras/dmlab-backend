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
});

const User = mongoose.model("user", userSchema);

app.listen(5000, () => {
  console.log("listenign bro");
});

app.get("/", (req, res) => {
  res.send("Hello wlrd");
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  const user = new User({
    id: req.body.id.toString(),
    name: req.body.name,
    email: req.body.email,
  });
  const userm = await User.findOne({ id: user.id });
  console.log(userm);
  if (userm) {
    res.send("exists");
  } else {
    user.save();
    res.send("ok");
  }
});
