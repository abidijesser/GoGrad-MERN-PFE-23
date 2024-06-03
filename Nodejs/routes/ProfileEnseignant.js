const express = require("express");
const dbObject = require("../configuartion/connect.js");
const mongoose= require('mongoose');
const router = express.Router();
const bcrypt = require("bcrypt");
const Enseignant = require("../models/Enseignant");
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

router.get("/getProfile/:EnseignantID",async(req,res)=>{
  try {
      const enseignant = await Enseignant.findOne({EnseignantID:req.params.EnseignantID})
      .select(' EnseignantID Nom Prenom Email Téléphone Departement Spécialité MotDePasse  -_id')
      .lean();
      if (!enseignant) {
        return res.status(404).json({ error: ERROR_MESSAGES.USER_NOT_FOUND});
      }
      res.status(200).json(enseignant);
    } catch (err) {
      handleErrors(res, err);
    }
});


   
async function verif(oldPassword, hashedPassword) {
      const match = await bcrypt.compare(oldPassword, hashedPassword);
      return Promise.resolve(match);
    };
router.patch("/updateProfile/:EnseignantID", async (req, res) => {
      const EnseignantID = req.params.EnseignantID;
      const {  Nom, Prenom,  Email, Departement, Spécialité,Telephone,AncienMotDePasse, MotDePasse, ConfirmationMotDePasse } = req.body  || {};
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
    
      try {
        const enseignants = await Enseignant.find({ EnseignantID });
    
        if (!enseignants || enseignants.length === 0) {
          return res.status(404).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        for (const enseignant of enseignants) {
            enseignant.Nom = Nom || enseignant.Nom;
            enseignant.Prenom = Prenom || enseignant.Prenom;
            enseignant.Spécialité = Spécialité || enseignant.Spécialité;
            enseignant.Telephone = Telephone || enseignant.Telephone;
           
    
          // Vérifier si l'utilisateur a fourni l'ancien mot de passe
          if (AncienMotDePasse && MotDePasse) {
            const match = await verif(AncienMotDePasse, enseignant.MotDePasse);
            if (!match) {
              return res.status(401).json({ error: ERROR_MESSAGES.INVALID_PASSWORD });
            }
    
            // Vérifier si le nouveau mot de passe et la confirmation sont identiques
            if (MotDePasse !== ConfirmationMotDePasse) {
              return res.status(400).json({ error: ERROR_MESSAGES.PASSWORDS_NOT_MATCH });
            }
    
            // Vérifier si le nouveau mot de passe est différent de l'ancien
            if (MotDePasse === enseignant.MotDePasse) {
              return res.status(400).json({ error: ERROR_MESSAGES.NEW_PASSWORD_SAME_AS_OLD });
            }
    
            // Hasher le nouveau mot de passe et l'enregistrer dans la base de données
            const hashedPassword = await bcrypt.hash(MotDePasse, salt);
            enseignant.MotDePasse = hashedPassword;
          } else {
            enseignant.MotDePasse = enseignant.MotDePasse;
          }
    
          enseignant.Email = Email || enseignant.Email;
    
          if (Email && enseignant.Email !== Email) {
            // Créer un code de validation
            const validationCode = Math.floor(100000 + Math.random() * 900000);
    
            // Envoyer un mail de validation du nouveau Email
            const Msg = {
              to: Email,
              subject: "Validation de votre nouvelle adresse Email",
              text: `Bonjour ${enseignant.Nom} ${enseignant.Prenom} , \n\n veuillez cliquer sur le lien suivant pour valider la nouvelle adresse email`,
            };
    
            await transporter.sendMail(Msg);
    
            // Enregistrer le code de validation dans la base de données
            enseignant.emailValidationCode = validationCode;
            enseignant.emailValidationExpires = Date.now() + 3600000; // 1h
          }
    
          if (Departement && enseignant.Departement !== Departement) {
            enseignant.Departement = Departement;
        
          }
    
          await enseignant.save();
        }
        res.status(200).json({ status: SUCCESS_MESSAGES.UPDATE_SUCCESS });
      } catch (err) {
        handleErrors(res, err);
      }
    });
    
    
    
    
router.delete("/deleteProfile/:EnseignantID",async(req,res)=>{
    try{
        const enseignant = await Enseignant.findOneAndDelete({EnseignantID:req.params.EnseignantID});
        if ( !enseignant) {
          return res.status(404).json({ error: ERROR_MESSAGES.DELETE_FAILED });
        }
        res.status(200).json({ status: SUCCESS_MESSAGES.DELETE_SUCCESS});
      } catch (err) {
        handleErrors(res, err);
      }
    
});    
module.exports = router;
