const express = require("express");
const router = express.Router();
const ChefDepartContro = require("../controllers/ChefDepart.js");
const ChefDepart = require("../models/ChefDepart.js");

// ajouter etudiant
router.post("/AjouteEnseignant/:ChefDepartID", function(req,res){
    ChefDepartContro.AjouteEnseignant(req,res);
} );
router.post("/AjouterEtudiant/:ChefDepartID",function(req,res){
    ChefDepartContro.AjouterEtudiant(req,res);
});
router.get("/GetEtudiantAffe/:ChefDepartID",function(req,res){
    ChefDepartContro.GetEtudiantAffe(req,res);
});
router.get('/GetEtudiantsAffectes/:ChefDepartID',function(req,res){
    ChefDepartContro.GetEtudiantsAffectes(req,res);
});
router.get('/GetEtudiantsNonAffectes/:ChefDepartID',function(req,res){
    ChefDepartContro.GetEtudiantsNonAffectes(req,res);
});
router.get("/GetEtudiantsAvecStatus/:ChefDepartID",function(req,res){
    ChefDepartContro.GetEtudiantsAvecStatus(req,res);
});
router.get("/GetEtudiantsAvecStatusStats/:ChefDepartID",function(req,res){
    ChefDepartContro.GetEtudiantsAvecStatusStats(req,res);
});
router.get('/GetNombreEtudiantsEnseignantsParDepartement/:ChefDepartID',function(req,res){
    ChefDepartContro.GetNombreEtudiantsEnseignantsParDepartement(req,res);
});
router.patch('/UpdateEnseignantByID/:ChefDepartID/:EnseignantID',function(req,res){
    ChefDepartContro.UpdateEnseignantByID(req,res);
});
router.patch("/UpdateEtudiantByID/:ChefDepartID/:EtudiantID",function(req,res){
    ChefDepartContro.UpdateEtudiantByID(req,res);
});
router.get("/GetEtudiant/:ChefDepartID/Etudiant/:EtudiantID",function(req,res){
    ChefDepartContro.GetEtudiant(req,res);
});
router.get("/GetEnseignant/:ChefDepartID/Enseignant/:EnseignantID",function(req,res){
    ChefDepartContro.GetEnseignant(req,res);
});
router.get("/GetEtudiants/:ChefDepartID",function(req,res){
    ChefDepartContro.GetEtudiants(req,res);
});
router.get("/GetEnseignants/:ChefDepartID",function(req,res){
    ChefDepartContro.GetEnseignants(req,res);
});
router.post("/AffecterEtudiant/:ChefDepartID/Etudiant/:EtudiantID/Enseignant/:EnseignantID",function(req,res){
    ChefDepartContro.AffecterEtudiant(req,res);
});

router.patch("/ModifierEtudiant/:ChefDepartID/Etudiant/:EtudiantID",function(req,res){
    ChefDepartContro.ModifierEtudiant(req,res);
});
router.delete("/SupprimerEtudiant/:ChefDepartID/Etudiant/:EtudiantID",function(req,res){
    ChefDepartContro.supprimerEtudiantById(req,res);
});
router.delete("/SupprimerEtudiants/:ChefDepartID",function(req,res){
    ChefDepartContro.supprimerTousEtudiants(req,res);
});
router.delete("/SupprimerEnseignant/:ChefDepartID/Enseignant/:EnseignantID", function(req,res){
    ChefDepartContro.supprimerEnseignantById(req,res);
});
router.get("/GetEtudiantAffe/:ChefDepartID", function(req,res){
    ChefDepartContro.GetEtudiantAffe(req,res)
});
router.get('/getEtudiantNonAffecte/:ChefDepartID',function(req,res){
    ChefDepartContro.getEtudiantNonAffecte(req,res)
});
module.exports=router;