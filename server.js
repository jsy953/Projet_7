const http = require('http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const dbURI = `mongodb+srv://Usertest:User95@cluster0.xork8jk.mongodb.net`;

app.use(express.json());


mongoose.connect(dbURI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(err => console.error('Connexion à MongoDB échouée !', err));


app.use(cors());


app.post('/api/auth/login', (req, res) => {
    res.send('Login route hit');
});

app.post('/api/auth/signup', (req, res) => {
    res.send(req.body);
});


app.listen(4000, () => {
    console.log('Server is running on port 4000');
});