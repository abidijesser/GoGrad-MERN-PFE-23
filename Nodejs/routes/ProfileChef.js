const express = require("express");
const dbObject = require("../configuartion/connect.js");
const ChefDepart= require('../models/ChefDepart');
const mongoose= require('mongoose');
const router = express.Router();
const bcrypt = require("bcrypt");

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

router.get("/GetProfile/:ChefDepartID", async (req, res) => {
  try {
    const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID })
      .select(" ChefDepartID Nom Prenom Email Departement   MotDePasse ")
      
      .lean();

    if (!chefDepart) {
      return res.status(404).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
    }

   

    // On retire les propriétés `_id` et `__v` de l'objet
    const chefDepartSansId = {
      ...chefDepart,
      _id: undefined,
      __v: undefined,
     
    };

    res.status(200).json(chefDepartSansId);
  } catch (err) {
    handleErrors(res, err);
  }
});

async function verif(oldPassword, hashedPassword) {
      const match = await bcrypt.compare(oldPassword, hashedPassword);
      return Promise.resolve(match);
    };
router.patch("/UpdateProfile/:ChefDepartID", async (req, res) => {
      const ChefDepartID = req.params.ChefDepartID 
      const {  Nom, Prenom,  Email, Departement,  AncienMotDePasse, MotDePasse, ConfirmationMotDePasse } = req.body  || {};
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
    
      try {
        const chefDeparts = await ChefDepart.find({ ChefDepartID });
    
        if (!chefDeparts || chefDeparts.length === 0) {
          return res.status(404).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });
        }
        for (const chefDepart of chefDeparts) {
            chefDepart.Nom = Nom || chefDepart.Nom;
            chefDepart.Prenom = Prenom || chefDepart.Prenom;
          // Vérifier si l'utilisateur a fourni l'ancien mot de passe
          if (AncienMotDePasse && MotDePasse) {
            const match = await verif(AncienMotDePasse, chefDepart.MotDePasse);
            if (!match) {
              return res.status(401).json({ error: ERROR_MESSAGES.INVALID_PASSWORD });
            }
    
            // Vérifier si le nouveau mot de passe et la confirmation sont identiques
            if (MotDePasse !== ConfirmationMotDePasse) {
              return res.status(400).json({ error: ERROR_MESSAGES.PASSWORDS_NOT_MATCH });
            }
    
            // Vérifier si le nouveau mot de passe est différent de l'ancien
            if (MotDePasse === chefDepart.MotDePasse) {
              return res.status(400).json({ error: ERROR_MESSAGES.NEW_PASSWORD_SAME_AS_OLD });
            }
    
            // Hasher le nouveau mot de passe et l'enregistrer dans la base de données
            const hashedPassword = await bcrypt.hash(MotDePasse, salt);
            chefDepart.MotDePasse = hashedPassword;
          } else {
            chefDepart.MotDePasse = chefDepart.MotDePasse;
          }
    
          chefDepart.Email = Email || chefDepart.Email;
    
          if (Email && chefDepart.Email !== Email) {
            // Créer un code de validation
            const validationCode = Math.floor(100000 + Math.random() * 900000);
    
            // Envoyer un mail de validation du nouveau Email
            const Msg = {
              to: Email,
              subject: "Validation de votre nouvelle adresse Email",
              text: `Bonjour ${chefDepart.Nom} ${chefDepart.Prenom} , \n\n veuillez cliquer sur le lien suivant pour valider la nouvelle adresse email`,
            };
    
            await transporter.sendMail(Msg);
    
            // Enregistrer le code de validation dans la base de données
            chefDepart.emailValidationCode = validationCode;
            chefDepart.emailValidationExpires = Date.now() + 3600000; // 1h
          }
    
          if (Departement && chefDepart.Departement !== Departement) {
            chefDepart.Departement = Departement;
            chefDepart.Filiere = Filiere;
          }
    
          await chefDepart.save();
        }
        res.status(200).json({ status: SUCCESS_MESSAGES.UPDATE_SUCCESS });
      } catch (err) {
        handleErrors(res, err);
      }
    });
    
    
 // an ne pas utliser   
// a supprimer 
router.delete("/DeleteProfil/:ChefDepartID",async(req,res)=>{
    try{
        const chefDepart = await ChefDepart.findOneAndDelete({ChefDepartID:req.params.ChefDepartID});
        if ( !chefDepart) {
          return res.status(404).json({ error: ERROR_MESSAGES.DELETE_FAILED });
        }
        res.status(200).json({ status: SUCCESS_MESSAGES.DELETE_SUCCESS});
      } catch (err) {
        handleErrors(res, err);
      }
    
});    
module.exports = router;
