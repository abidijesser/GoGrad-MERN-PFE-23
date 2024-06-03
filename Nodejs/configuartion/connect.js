//db
const mongoose= require('mongoose');
const Etudiant = require('../models/Etudiant');
const Enseignant = require('../models/Enseignant');
const ChefDepart = require('../models/ChefDepart');
const Encadrant = require('../models/Encadrant');
const Admin = require('../models/Admin');
const Stage = require('../models/Stage');

mongoose.connect('mongodb://127.0.0.1:27017/register',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB:'));
db.once('open', function() {
  console.log('Connexion à la base de données établie !');
  
});


const dbObject = { mongoose: mongoose, Etudiant:Etudiant };
const dbObjectU = { mongoose: mongoose,  Enseignant:Enseignant };
const dbObjectChef = {mongoose:mongoose, ChefDepart:ChefDepart};
const dbObjectEnc = { mongoose:mongoose , Encadrant:Encadrant};
const dbAdmin = { mongoose : mongoose , Admin:Admin};
const dbStage = { mongoose : mongoose , Stage:Stage};


module.exports = {
  dbObject,
  dbObjectU,
  dbObjectChef,
  dbObjectEnc,
  dbAdmin,
  dbStage,
 
};  