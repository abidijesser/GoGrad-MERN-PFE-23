const mongoose=require('mongoose');




const EncadrantSchema = new mongoose.Schema({
  EncadrantID:{
    type:String,
    required:true,
  },
  Nom: {
    type: String,
    trim: true
  },
  Prenom: {
    type: String,
    trim: true
  },
  Email: {
    type: String,
  
  },
  Téléphone: {
    type: String,
    unique: true
  },
 
  MotDePasse: {
    type: String,
    required: true
  },
  codeValidation: {
    type: Number,
    
  },
  validationCodeExpiration: {
    type: Date,
  },
  //cette variable elle sert de verifier le compte de user par mail
  
  salt: String
}, { timestamps: true });

const Encadrant = mongoose.model('Encadrant', EncadrantSchema);
module.exports = Encadrant;