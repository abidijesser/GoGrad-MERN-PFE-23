const express = require("express");
const dbObject = require("../configuartion/connect.js");
const mongoose= require('mongoose');
const router = express.Router();
const bcrypt = require("bcrypt");
const Encadrant = require("../models/Encadrant");
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

router.get("/GetProfil/:EncadrantID",async(req,res)=>{
  try {
      const encadrant = await Encadrant.findOne({EncadrantID:req.params.EncadrantID})
      .select('Nom Prenom Email Téléphone MotDePasse  -_id')
      .lean();
      if (!encadrant) {
        return res.status(404).json({ error: ERROR_MESSAGES.USER_NOT_FOUND});
      }
      res.status(200).json(encadrant);
    } catch (err) {
      handleErrors(res, err);
    }
});

async function verif(oldPassword, hashedPassword) {
      const match = await bcrypt.compare(oldPassword, hashedPassword);
      return Promise.resolve(match);
    };
router.patch("/updateProfil/:EncadrantID", async (req, res) => {
      const EncadrantID = req.params.EncadrantID;
      const {  Nom, Prenom,  Email, Téléphone,Departement, AncienMotDePasse, MotDePasse, ConfirmationMotDePasse } = req.body  || {};
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
    
      try {
        const encadrants = await Encadrant.find({ EncadrantID });
    
        if (!encadrants || encadrants.length === 0) {
          return res.status(404).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        for (const encadrant of encadrants) {
            encadrant.Nom = Nom || encadrant.Nom;
            encadrant.Prenom = Prenom || encadrant.Prenom;
           
    
          // Vérifier si l'utilisateur a fourni l'ancien mot de passe
          if (AncienMotDePasse && MotDePasse) {
            const match = await verif(AncienMotDePasse, encadrant.MotDePasse);
            if (!match) {
              return res.status(401).json({ error: ERROR_MESSAGES.INVALID_PASSWORD });
            }
    
            // Vérifier si le nouveau mot de passe et la confirmation sont identiques
            if (MotDePasse !== ConfirmationMotDePasse) {
              return res.status(400).json({ error: ERROR_MESSAGES.PASSWORDS_NOT_MATCH });
            }
    
            // Vérifier si le nouveau mot de passe est différent de l'ancien
            if (MotDePasse === encadrant.MotDePasse) {
              return res.status(400).json({ error: ERROR_MESSAGES.NEW_PASSWORD_SAME_AS_OLD });
            }
    
            // Hasher le nouveau mot de passe et l'enregistrer dans la base de données
            const hashedPassword = await bcrypt.hash(MotDePasse, salt);
            encadrant.MotDePasse = hashedPassword;
          } else {
            encadrant.MotDePasse = encadrant.MotDePasse;
          }
    
          encadrant.Email = Email || encadrant.Email;
    
          if (Email && encadrant.Email !== Email) {
            // Créer un code de validation
            const validationCode = Math.floor(100000 + Math.random() * 900000);
    
            // Envoyer un mail de validation du nouveau Email
            const Msg = {
              to: Email,
              subject: "Validation de votre nouvelle adresse Email",
              text: `Bonjour ${encadrant.Nom} ${encadrant.Prenom} , \n\n veuillez cliquer sur le lien suivant pour valider la nouvelle adresse email`,
            };
    
            await transporter.sendMail(Msg);
    
            // Enregistrer le code de validation dans la base de données
            encadrant.emailValidationCode = validationCode;
            encadrant.emailValidationExpires = Date.now() + 3600000; // 1h
          }
    
          if (Departement && encadrant.Departement !== Departement) {
            encadrant.Departement = Departement;
        
          }
    
          await encadrant.save();
        }
        res.status(200).json({ status: SUCCESS_MESSAGES.UPDATE_SUCCESS });
      } catch (err) {
        handleErrors(res, err);
      }
    });
router.delete("/deleteProfil/:EncadrantID",async(req,res)=>{
    try{
        const encadrant = await Encadrant.findOneAndDelete({EncadrantID:req.params.EncadrantID});
        if ( !encadrant) {
          return res.status(404).json({ error: ERROR_MESSAGES.DELETE_FAILED });
        }
        res.status(200).json({ status: SUCCESS_MESSAGES.DELETE_SUCCESS});
      } catch (err) {
        handleErrors(res, err);
      }
    
});    
module.exports = router;
