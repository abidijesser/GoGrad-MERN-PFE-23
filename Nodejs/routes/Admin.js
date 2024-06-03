const express = require("express");
const router = express.Router();
const AdminContro = require("../controllers/AdminContro.js");
const Admin = require("../models/Admin.js");
router.post('/AjouteChefDepart', function(req,res){
    AdminContro.AjouteChefDepart(req,res);
});
router.post('/AjouteAdmin', function(req,res){
    AdminContro.AjouteAdmin(req,res);
});
router.patch('/UpdateChefDepartByID/:ChefDepartID',function(req,res){
    AdminContro.UpdateChefDepartByID(req,res);
});
router.get('/getEtudiants',function(req,res){
    AdminContro.getEtudiants(req,res);
});
router.get('/getEnseignantByDep',function(req,res){
    AdminContro.getEnseignantByDep(req,res);
});
router.get('/getEtudiantByDep',function(req,res){
    AdminContro.getEtudiantByDep(req,res);
});
router.get('/getChefDepart',function(req,res){
    AdminContro.getChefDepart(req,res);
});
router.delete('/SupprimerEtudiantById/:EtudiantID',function(req,res){
    AdminContro.SupprimerEtudiantById(req,res);
});
router.delete('/SupprimerEnseignantById',function(req,res){
    AdminContro.SupprimerEnseignantById(req,res);
});
router.get('/getChefDepartByDep',function(req,res){
    AdminContro.getChefDepartByDep(req,res);
});
module .exports = router;