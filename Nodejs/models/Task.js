const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    TaskID:{
        type:String,
        required:true
      },
      Nom: {
        type: String,
        required: true,
        trim: true
      },
      Fichier: {
        type: String,
        trim: true
      },
      DateAjout: {
        type: Date,
        default: Date.now
      },
      DateÉcheance: {
        type: Date,
    
      },
      EtudiantID: { type: String, required: true },
      Validate : {
        type:Boolean,
        default:false
      },
      Priorise :{
        type:Boolean,
        default:false
      },


});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;