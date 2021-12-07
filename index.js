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

app.listen(5000, () => {
	console.log("listenign bro");
});

app.get("/", (req, res) => {
	res.send("Hello wlrd");
});

app.post("/login", async (req, res) => {
	console.log(req.body);
	const user = new User({
		id: req.body.id.toString(),
		name: req.body.name,
		email: req.body.email,
		location: null,
		artists: [],
	});
	const userm = await User.findOne({ id: user.id });
	console.log(userm);
	if (userm) {
		res.send(JSON.stringify(userm));
	} else {
		user.save();
		res.send("ok");
	}
});

app.get("/user/:id", async (req, res) => {
	const id = req.params;
	console.log("tu sam", id);
	const userm = await User.findOne({ id: req.params.id });
	console.log(userm);
	res.send(JSON.stringify(userm));
});

app.put("/userFavourites/:id", async (req, res) => {
	//handleaj mjenjanje lokacije ili dodavanje artista
	console.log(req.body.name);
	const userm = await User.findOneAndUpdate(
		{ id: req.params.id },
		{ $addToSet: { artists: req.body.name } }
	);
	res.send("ok");
});

app.put("/userLocation/:id", async (req, res) => {
	//handleaj mjenjanje lokacije ili dodavanje artista
	console.log(req.body.location);
	const userm = await User.findOneAndUpdate(
		{ id: req.params.id },
		{ $set: { location: req.body.location } }
	);
	res.send("ok");
});
