const mongoose=require('mongoose');




const ResponsableSchema = new mongoose.Schema({
  ResponsableID:{
    type:String,
    required:true,
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
 
  MotDePasse: {
    type: String,
    required: true
  },
  //cette variable elle sert de verifier le compte de user par mail
  
  salt: String
}, { timestamps: true });

const Responsable = mongoose.model('Responsable', ResponsableSchema);
module.exports = Responsable;