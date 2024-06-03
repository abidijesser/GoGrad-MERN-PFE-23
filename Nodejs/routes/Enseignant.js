const express = require("express");
const router = express.Router();

const EnseignantContro = require("../controllers/EnseignantContro.js");
const Enseignant = require("../models/Enseignant.js");
router.get('/gererDemande/:EtudiantID/:EnseignantID',function(req,res){
    EnseignantContro.gererDemande(req,res);
});
router.delete('/SupprimeStages/:EnseignantID/:StageID',function(req,res){
    EnseignantContro.SupprimeStages(req,res);
});
router.get('/gererDemandeStage/:EtudiantID/:EnseignantID/:StageID',function(req,res){
    EnseignantContro.gererDemandeStage(req,res);
});
router.get('/GetStagesbyEnseignantAbc/:EnseignantID',function(req,res){
    EnseignantContro.GetStagesbyEnseignantAbc(req,res);
});
router.get('/GetMyStages/:EnseignantID',function(req,res){
    EnseignantContro.GetMyStages(req,res);
});
router.get('/GetStagesbyEnseignantID/:EnseignantID',function(req,res){
    EnseignantContro.GetStagesbyEnseignantID(req,res);
});
router.get('/getEtudiantsEncadres/:EnseignantID',function(req,res){
    EnseignantContro.getEtudiantsEncadres(req,res);
});
router.get("/GetEtudiant/:EtudiantID",function(req,res){
    EnseignantContro.GetEtudiant(req,res);
});
router.post("/AjouterStages/:EnseignantID",function(req,res){
    EnseignantContro.AjouterStages(req,res);
});
router.patch("/ModifieStages/:EnseignantID/:StageID",function(req,res){
    EnseignantContro.ModifieStages(req,res);
});
router.get("/GetEtudiants",function(req,res){
    EnseignantContro.GetEtudiants(req,res);
});
router.post('/AjouterSujet/:EnseignantID',function(req,res){
    EnseignantContro.AjouterSujet(req,res);
});
router.patch('/ModifierSujet',function(req,res){
    EnseignantContro.ModifierSujet(req,res);
});
router.delete('/SupprimerSujet',function(req,res){
    EnseignantContro.SupprimerSujet(req,res);
});
router.get('/GetSujets/:EnseignantID', function(req,res){
    EnseignantContro.GetSujets(req,res);
});
router.get('/getSujetById',function(req,res){
    EnseignantContro.getSujetById(req,res);
});

router.get('/GetStudentTasks', function(req,res){
    EnseignantContro.GetStudentTasks(req,res);
});
router.get('/getTasksByDateA',function(req,res){
    EnseignantContro.getTasksByDateA(req,res);
});
router.get('/getTasksByDateD',function(req,res){
    EnseignantContro.getTasksByDateD(req,res);
});
router.get('/getTaskByID',function(req,res){
    EnseignantContro.getTaskByID(req,res);
});
router.post('/AddTask', function(req,res){
    EnseignantContro.AddTask(req,res);
});
router.post('/ValidateTask', function (req,res){
    EnseignantContro.ValidateTask(req,res);
});
router.post('/PrioriseTask',function(req,res){
    EnseignantContro.PrioriseTask(req,res);
});

// ajouter etudiant
router.post("/AjouterEnseignant/:EnseignantID", function(req,res){
    EnseignantContro.AjouterEnseignant(req,res);
} );
router.post("/ajouterEtudiant/:EnseignantID",function(req,res){
    EnseignantContro.ajouterEtudiant(req,res);
});
router.get("/GetEtudiantAffectesEncadrant/:EnseignantID",function(req,res){
    EnseignantContro.GetEtudiantAffectesEncadrant(req,res);
});
router.get("/GetEtudiant/:EnseignantID/Etudiant/:EtudiantID",function(req,res){
    EnseignantContro.GetEtudiant(req,res);
});
router.get("/getEnseignant/:EnseignantID1/Enseignant/:EnseignantID2", function(req, res) {
    EnseignantContro.getEnseignant(req, res);
  });
  
router.get("/GetEtudiants/:EnseignantID",function(req,res){
    EnseignantContro.GetEtudiants(req,res);
});
router.get("/GetEnseignants/:EnseignantID",function(req,res){
    EnseignantContro.GetEnseignants(req,res);
});
router.post("/AffecterEtudiant/:EnseignantID/Etudiant/:EtudiantID/Enseignant/:EnseignantID",function(req,res){
    EnseignantContro.AffecterEtudiant(req,res);
});

router.patch("/ModifierEtudiant/:EnseignantID/Etudiant/:EtudiantID",function(req,res){
    EnseignantContro.ModifierEtudiant(req,res);
});
router.delete("/SupprimerEtudiant/:EnseignantID/Etudiant/:EtudiantID",function(req,res){
    EnseignantContro.supprimerEtudiantById(req,res);
});
router.delete("/SupprimerEtudiants/:EnseignantID",function(req,res){
    EnseignantContro.supprimerTousEtudiants(req,res);
});
router.delete("/SupprimerEnseignant/:EnseignantID/Enseignant/:EnseignantID", function(req,res){
    EnseignantContro.supprimerEnseignantById(req,res);
});
router.get("/getEtudiantAffe/:EnseignantID", function(req,res){
    EnseignantContro.getEtudiantAffe(req,res)
});
router.get('/getEtudiantNonAffecte/:EnseignantID',function(req,res){
    EnseignantContro.getEtudiantNonAffecte(req,res)
});
module.exports=router;