const mongoose=require('mongoose');





const ChefDepartSchema = new mongoose.Schema({
  ChefDepartID:{
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
  Téléphone: {
    type: String,
    unique: true
  },
  Departement: {
    type: String,
    required: true
  },
 
  MotDePasse: {
    type: String,
    required: true
  },
  //cette variable elle sert de verifier le compte de user par mail
  codeValidation: {
    type: Number,
    
  },
  validationCodeExpiration: {
    type: Date,
  },
  salt: String
}, { timestamps: true });

const ChefDepart = mongoose.model('ChefDepart', ChefDepartSchema);
module.exports = ChefDepart;