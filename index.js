const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const connString =
	"mongodb+srv://admin:admin@cluster.nkyj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(connString);
mongoose.connection.once("open", () => {
	console.log("connected bro");
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var Schema = mongoose.Schema;

var userSchema = new Schema({
	id: String,
	name: String,
	email: String,
});

var User = mongoose.model("user", userSchema);

app.listen(5000, () => {
	console.log("listenign bro");
});

app.get("/", (req, res) => {
	res.send("Hello wlrd");
});

app.post("/register", (req, res) => {
	console.log(req.body);
	const user = new User({
		id: req.body.id.toString(),
		name: "test bolan",
		email: "email@com",
	});
	user.save();
	res.send("ok");
});
