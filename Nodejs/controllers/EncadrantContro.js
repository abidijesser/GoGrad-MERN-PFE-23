const bcrypt = require("bcrypt");
const Etudiant = require('../models/Etudiant');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const Encadrant = require("../models/Encadrant");
 //token: k1h8s270AR3B9h0
const EncadrantContro={
gererDemande: async function(req, res) {
  try {
    const encadrant  = await Encadrant.findOne({ EncadrantID: req.body.EncadrantID });
    const enseignant = await Enseignant.findOne({ EnseignantID: req.body.EnseignantID });
    const action = req.query.action;

    if (!etudiant || !enseignant) {
      return res.status(404).json({ error: "L'étudiant ou l'enseignant est introuvable!" });
    }

    const Stage = etudiant.Stage;
    if (action === 'accepter') {
      Stage.EncadrantUniversitaire = enseignant.Nom;
      enseignant.etudiantsEncadres.push(etudiant);
      await Stage.save();
      await enseignant.save();

      // send acceptance email to student
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:"gogradpfe@gmail.com",
            pass:"zpzjmvdyannqxrsl",  
        }
      });

      const mailOptions = {
        from: "gogradpfe@gmail.com",  
        to: etudiant.Email,  
        subject: 'Votre demande a été acceptée',
        text: 'Bonjour,\n\nVotre demande a été acceptée avec succès!\n\nCordialement,\n\nL\'équipe de gestion des stages'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      return res.status(200).json({ message: "La demande a été acceptée avec succès!" });
    } else if (action === 'refuser') {

      // send rejection email to student
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user:"gogradpfe@gmail.com",
            pass:"zpzjmvdyannqxrsl", 
        }
      });

      const mailOptions = {
        from: 'gogradpfe@gmail.com',  
        to: etudiant.Email,  
        subject: 'Votre demande a été refusée',
        text: 'Bonjour,\n\nVotre demande a été refusée.\n\nCordialement,\n\nL\'équipe de gestion des stages'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      return res.status(200).json({ message: "La demande a été refusée!" });
    } else {
      return res.status(400).json({ error: "Action non valide!" });
    }
  } catch(error) {
    console.log(error); 
    return res.status(500).json({ error: "Une erreur s'est produite lors de la gestion de la demande!" });
  }
},

GetEtudiant: async function(req, res) {
    try {
      const etudiants = await Etudiant.find({EtudiantID:req.body.EtudiantID});
      if (!etudiants) {
        return res.status(404).json({ message: "L'étudiant n'existe pas" });
      }
      for (let i = 0; i < etudiants.length; i++) {
        const { Nom, Prenom, Email, Departement, Filiere, Stage } = etudiants[i];
        res.status(200).json({ Nom, Prenom, Email, Departement, Filiere, Stage });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'étudiant" });
    }
  },
  
GetEtudiants: async function(req, res) {
    try {
            const etudiants = await Etudiant.find({});
            const etudiantsProfiles = etudiants.map(etudiant => {
                const { Nom, Prenom, Email, Departement, Filiere, Stage } = etudiant;
                return { Nom, Prenom, Email, Departement, Filiere, Stage };
            });
            res.status(200).json(etudiantsProfiles);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur lors de la récupération des étudiants" });
        }
    },
          

}




module.exports= EncadrantContro;