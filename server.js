const http = require('http');
const mongoose = require('mongoose');

const dbURI = `mongodb+srv://Usertest:User95@cluster0.xork8jk.mongodb.net`;

const server = http.createServer((req, res) => {
    res.end('Voilà la réponse du serveur !');
});

server.listen(process.env.PORT || 3000);


mongoose.connect(dbURI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(err => console.error('Connexion à MongoDB échouée !', err));
