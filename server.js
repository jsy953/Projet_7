const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 4000;
require("dotenv").config();
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const path = require("path");

app.listen(PORT, () => {
	console.log(PORT);
});

if (!process.env.CONNEXION) {
	console.error("Erreur : Variable de connexion non definie dans le dossier '.env' !");
	process.exit(1);
}

mongoose.connect(`mongodb+srv://${process.env.CONNEXION}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => console.log("Connection a MongoDB reussi!"))
	.catch((error) => console.log(error, "Connection a MongoDB echouer!"));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use(express.json());
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;