const express = require("express");
const router = express.Router();


const EtudiantContro = require("../controllers/EtudiantContro.js");
const Etudiant = require("../models/Etudiant.js");


// ajouter etudiant
router.post("/AjouteEtudiant", function(req,res){
    EtudiantContro.Inscription(req,res);
} );
//deposer stage
router.post("/DeposerStage/:EtudiantID",function(req,res){
  EtudiantContro.DeposerStage(req,res);
});
//get stage
router.get("/getStage/:EtudiantID" , function(req,res){
  EtudiantContro.getStage(req,res);
});
//update stage
router.patch("/updateStage/:EtudiantID", function(req,res){
  EtudiantContro.updateStage(req,res);
});
router.get("/GetEnseignants/:EtudiantID",function(req,res){
  EtudiantContro.GetEnseignants(req,res);
});

//demande d'encadrement
router.post("/DemanderEncadrement/:EtudiantID/:EnseignantID",function (req,res) {
  EtudiantContro.DemanderEncadrement(req,res);
});
router.get("/getSujets/:EtudiantID",function(req,res){
  EtudiantContro.getSujets(req,res);
});
router.post("/DemanderStage/:EtudiantID/from/:EnseignantID/Stage/:StageID", function(req,res){
  EtudiantContro.DemanderStage(req,res);
});
router.post("/AjouterStage/:EtudiantID", function(req,res){
  EtudiantContro.AjouterStage(req,res);
});
router.get('/GetSujetById/:EtudiantID',function(req,res){
  EtudiantContro.GetSujetById(req,res);
});
router.post('/CreateTask/:EtudiantID', function(req,res){
  EtudiantContro.CreateTask(req,res);
});
router.get('/GetTasks/:EtudiantID', function(req,res){
  EtudiantContro.GetTasks(req,res);
});
router.get('/GetTasksOA/:EtudiantID',function(req,res){
  EtudiantContro.GetTasksOA(req,res);
});
router.patch("/ModifieStage/:EtudiantID/:StageID",function(req,res){
  EtudiantContro.ModifieStage(req,res);
});
router.get('/GetStagesByEnseignantID/:EtudiantID/:EnseignantID',function(req,res){
  EtudiantContro.GetStagesByEnseignantID(req,res);
});
router.get('/GetTasksByDateA/:EtudiantID/:EnseignantID',function(req,res){
  EtudiantContro.GetTasksByDateA(req,res);
});
router.get('/GetTasksByDateD/:EtudiantID', function(req,res){
  EtudiantContro.GetTasksByDateD(req,res);
});
router.get('/GetTaskByID//:EtudiantID', function(req,res){
  EtudiantContro.GetTaskByID(req,res);
  
});
router.delete('/DeleteTask/:EtudiantID', function(req,res){
  EtudiantContro.DeleteTask(req,res);
});
router.patch('/ModifieTask/:EtudiantID',function(req,res){
  EtudiantContro.ModifieTask(req,res);
});
router.post("/AjouterEncadrantPro/:EtudiantID",function(req,res){
  EtudiantContro.AjouterEncadrantPro(req,res);
});

 




module.exports = router;