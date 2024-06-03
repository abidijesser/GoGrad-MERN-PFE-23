const express = require("express");
const dbObject = require("../configuartion/connect.js");
const Etudiant= require('../models/Etudiant');
const Stage = require('../models/Stage');
const mongoose= require('mongoose');
const router = express.Router();
const bcrypt = require("bcrypt");
const {ObjectId}= require('mongodb');
const ERROR_MESSAGES = {
  USER_NOT_FOUND: "L'utilisateur n'existe pas!",
  UPDATE_FAILED: "Impossible de mettre à jour le profil",
  DELETE_FAILED: "Impossible de supprimer le profil",
  INVALID_PASSWORD:"mot de passe invalide!",
  PASSWORDS_NOT_MATCH:"les deux mots de  passes ne sont pas identiques",
  NEW_PASSWORD_SAME_AS_OLD:"Changer ce mot de passe l'utliser precedement",
};

const SUCCESS_MESSAGES = {
  UPDATE_SUCCESS: "La mise à jour du profil est faite avec succès",
  DELETE_SUCCESS: "Profil supprimé avec succès!",
};

const handleErrors = (res, error) => {
  console.error(error);
  res.status(500).json({ error: error.message || ERROR_MESSAGES.UPDATE_FAILED });
};

router.get("/getProfil/:EtudiantID", async (req, res) => {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID })
      .select("EtudiantID Nom Prenom Email Departement Filiere Niveau MotDePasse")
      .lean();

    if (!etudiant) {
      return res.status(404).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
    }

    etudiant.stages = await Stage.find({ EtudiantID: req.params.EtudiantID })
      .select("StageID Titre Description Technologie DateAjout DateFin ProposePar Societe Responsable EncadrantProfessionnel")
      .lean();

    res.status(200).json(etudiant);
  } catch (err) {
    handleErrors(res, err);
  }
});




async function verif(oldPassword, hashedPassword) {
      const match = await bcrypt.compare(oldPassword, hashedPassword);
      return Promise.resolve(match);
    };
router.patch("/updateProfil/:EtudiantID", async (req, res) => {
      const EtudiantID = req.params.EtudiantID 
      const {  Nom, Prenom,  Email, Departement, Filiere,Niveau,  AncienMotDePasse, MotDePasse, ConfirmationMotDePasse } = req.body  || {};
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
    
      try {
        const etudiants = await Etudiant.find({ EtudiantID });
        const stage =  await Stage.find({EtudiantID});
        if(!stage){
          return res.status(404).json({error:"Stage introuvable"});
        }
    
        if (!etudiants || etudiants.length === 0) {
          return res.status(404).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        for (const etudiant of etudiants) {
          etudiant.Nom = Nom || etudiant.Nom;
          etudiant.Prenom = Prenom || etudiant.Prenom;
          etudiant.Niveau = Niveau || etudiant.Niveau;
        
    
          // Vérifier si l'utilisateur a fourni l'ancien mot de passe
          if (AncienMotDePasse && MotDePasse) {
            const match = await verif(AncienMotDePasse, etudiant.MotDePasse);
            if (!match) {
              return res.status(401).json({ error: ERROR_MESSAGES.INVALID_PASSWORD });
            }
    
            // Vérifier si le nouveau mot de passe et la confirmation sont identiques
            if (MotDePasse !== ConfirmationMotDePasse) {
              return res.status(400).json({ error: ERROR_MESSAGES.PASSWORDS_NOT_MATCH });
            }
    
            // Vérifier si le nouveau mot de passe est différent de l'ancien
            if (MotDePasse === etudiant.MotDePasse) {
              return res.status(400).json({ error: ERROR_MESSAGES.NEW_PASSWORD_SAME_AS_OLD });
            }
    
            // Hasher le nouveau mot de passe et l'enregistrer dans la base de données
            const hashedPassword = await bcrypt.hash(MotDePasse, salt);
            etudiant.MotDePasse = hashedPassword;
          } else {
            etudiant.MotDePasse = etudiant.MotDePasse;
          }
    
          etudiant.Email = Email || etudiant.Email;
    
          if (Email && etudiant.Email !== Email) {
            // Créer un code de validation
            const validationCode = Math.floor(100000 + Math.random() * 900000);
    
            // Envoyer un mail de validation du nouveau Email
            const Msg = {
              to: Email,
              subject: "Validation de votre nouvelle adresse Email",
              text: `Bonjour ${etudiant.Nom} ${etudiant.Prenom} , \n\n veuillez cliquer sur le lien suivant pour valider la nouvelle adresse email`,
            };
    
            await transporter.sendMail(Msg);
    
            // Enregistrer le code de validation dans la base de données
            etudiant.emailValidationCode = validationCode;
            etudiant.emailValidationExpires = Date.now() + 3600000; // 1h
          }
    
          if (Departement && etudiant.Departement !== Departement) {
            etudiant.Departement = Departement;
            etudiant.Filiere = Filiere;
          }
    
          await etudiant.save();
        }
        res.status(200).json({ status: SUCCESS_MESSAGES.UPDATE_SUCCESS });
      } catch (err) {
        handleErrors(res, err);
      }
    });
    
    
 // an ne pas utliser   
// a supprimer 
router.delete("/deleteProfil/:EtudiantID",async(req,res)=>{
    try{
        const etudiant = await Etudiant.findOneAndDelete({EtudiantID:req.params.EtudiantID});
        if ( !etudiant) {
          return res.status(404).json({ error: ERROR_MESSAGES.DELETE_FAILED });
        }
        res.status(200).json({ status: SUCCESS_MESSAGES.DELETE_SUCCESS});
      } catch (err) {
        handleErrors(res, err);
      }
    
});    
module.exports = router;
