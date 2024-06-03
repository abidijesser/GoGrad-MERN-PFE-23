const AppPass="zpzjmvdyannqxrsl";
const EmailAPP="gogradpfe@gmail.com";
const express = require('express');
const nodemailer = require('nodemailer');
const Etudiant = require('../models/Etudiant');
const config = require('../configuartion/connect');
const router = express.Router();
const { dbObject } = require('../configuartion/connect');
const csvtojson = require('csvtojson');
const json2csv = require('json2csv').parse;
const multer = require('multer');

// Set up Multer storage engine
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// POST request for creating new students from a CSV or JSON file
router.post('/etudiants', upload.single('file'), async (req, res) => {
  try {
    const { type } = req.query;
    console.log(type);
    const file = req.file.buffer.toString('utf8');

    let etudiants;

    if (type === 'csv') {
      etudiants = await csvtojson().fromString(file);
    } else if (type === 'json') {
      etudiants = JSON.parse(file);
    } else {
      return res.status(400).json({ message: 'Type de fichier non pris en charge.' });
    }

    const result = [];

    for (const etudiant of etudiants) {
      const { Nom, Prenom, Email, Departement, Filiere, Niveau } = etudiant;
      const MotDePasse = await generateRandomPassword(12);
      const EtudiantID = await generateID(8);

      const newEtudiant = new dbObject.Etudiant({
        EtudiantID,
        Nom,
        Prenom,
        Email,
        Departement,
        Filiere,
        Niveau,
        MotDePasse
      });

      await newEtudiant.save();

      // Send the login information to the student
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EmailAPP,
          pass:AppPass
        }
      });

      const mailOptions = {
        from: EmailAPP,
        to: Email,
        subject: 'Informations de connexion',
        text: `Bonjour ${Nom} ${Prenom},
      
      Vous avez maintenant accès à votre compte sur notre plateforme. Veuillez trouver ci-dessous vos informations de connexion :
      - Identifiant : ${EtudiantID}
      - Mot de passe : ${MotDePasse}
      
      Nous vous recommandons de changer votre mot de passe dès votre première connexion pour des raisons de sécurité.
      
      Si vous avez des questions ou des problèmes, n'hésitez pas à nous contacter.
      
      Cordialement,
      L'équipe de la plateforme.`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      result.push(newEtudiant);
    }

    if (type === 'csv') {
      const csv = json2csv(result, { fields: ['EtudiantID', 'Nom', 'Prenom', 'Email', 'Departement', 'Filiere', 'Niveau', 'MotDePasse'] });
      res.attachment('etudiants.csv').send(csv);
    } else {
      res.status(201).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la création de l\'étudiant.' });
  }
});

module.exports = router;
