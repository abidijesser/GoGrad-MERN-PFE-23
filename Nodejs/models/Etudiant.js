const mongoose = require('mongoose');

//const DepartementEnum = {
  //Informatique:'Informatique',
  //Physique: 'Physique',
  //Chimie: 'Chimie'
//};

//const FiliereEnum = {
  //Informatique:['LGLSI','MISI'], 
  //Physique: ['EEA', 'SE', 'AAA'],
  //Chimie: ['LCR', 'LCM', 'LCMM']
//};
const StatusEnum = {
  PasEncore: 'pas encore',
  EnAttente: 'En attente',
  Refuser: 'refuser',
  Accepter: 'accepter'
};

 
const EtudiantSchema = new mongoose.Schema({
  EtudiantID:{
    type:String,
    required:true
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
    unique: true,
  },
  Departement: {
    type: String,
    required: true
  },

  Filiere: {
    type: String,
    required: true
  },
  Niveau:{
    type:String,
    required:true,
  },
  
  MotDePasse: {
    type: String,
    required: true
  },
 
  stages :[{type : mongoose.Schema.Types.ObjectId , ref :'Stage'}],
  EncadrementStatus: {
    type: String,
    enum: Object.values(StatusEnum),
    default: StatusEnum.PasEncore,
    
  },
  codeValidation: {
    type: Number,
    
  },
  validationCodeExpiration: {
    type: Date,
  },
  taches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tache' }],
  Demande: {
    type: Boolean,
    default: false
  },
 
  salt: String
}, { timestamps: true });

const Etudiant = mongoose.model('Etudiant', EtudiantSchema);
module.exports = Etudiant;


