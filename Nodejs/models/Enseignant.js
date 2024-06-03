const mongoose = require('mongoose');
const EtudiantSchema = require('../models/Etudiant');

//const DepartementEnum = {
  //Informatique: 'Informatique',
  //Physique: 'Physique',
  //Chimie: 'Chimie'
//};


const EnseignantSchema = new mongoose.Schema({
  EnseignantID: {
    type: String,
    required: true
  },
  Nom: {
    type: String,
    required: true,
    trim: true
  },
  Prenom: {
    type: String,
    required: true,
    trim: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  
  Departement: {
    type: String,
    
    required: true
  },
  
  Telephone:{
    type:String,
   

  },

  MotDePasse: {
    type: String,
    required: true
  },
  ChefDepartement:{
    type: Boolean,
    default: false
  },
  codeValidation: {
    type: Number
  },
  validationCodeExpiration: {
    type: Date
  },
  salt: String
}, { timestamps: true });

const Enseignant = mongoose.model('Enseignant', EnseignantSchema);
module.exports = Enseignant;
