const mongoose = require('mongoose');




const StageSchema = new mongoose.Schema({
  StageID: {
    type: String
  },
  EtudiantID: {
    type: String,
    trim: true
  },
  EnseignantID: {
    type: String,
    trim: true
  },
  EncadrantID :{
    type: String,
    trim: true
  },
  Titre: {
    type: String,
    required: true,
    unique: true
  },
  Description: {
    type: String
  },
  Technologie: {
    type: String
  },
  DateAjout: {
    type: Date,
    default: Date.now
  },
  DateFin: {
    type: Date,
    default: Date
  },
  ProposePar :{
    type:String
  },
  Societe: {
    type: String
  },
  Responsable: {
    type: String
  },
  EncadrantProfessionnel: {
    type: String,
    default:""
  },
  
  AccepterBtnClicked:{
    type: Boolean,
    default: false},
  RefuserBtnClicked: {
    type: Boolean,
    default: false
  },
 
  salt: String
}, { timestamps: true });

const Stage = mongoose.model('Stage', StageSchema);

module.exports = Stage;
