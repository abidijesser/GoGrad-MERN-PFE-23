const mongoose=require('mongoose');


const AdminSchema = new mongoose.Schema({
  AdminID:{
    type:String,

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
  salt: String
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;