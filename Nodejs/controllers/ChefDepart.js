const bcrypt = require("bcrypt");
const ChefDepart = require('../models/ChefDepart');
const Etudiant = require('../models/Etudiant');
const Enseignant = require('../models/Enseignant');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const JWT_SECRET = "k1h8s270AR3B9h0"; 
const AppPass="zpzjmvdyannqxrsl";
const Stage = require('../models/Stage');
const EmailAPP="gogradpfe@gmail.com";
const {ObjectId}= require('mongodb');
ObjectId.toString();

 //token: k1h8s270AR3B9h0
 // fonction pour generr un mot de passev aleatoire quoi sera envoye par email au utlisateurs
async function generateRandomPassword(length) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }
  //fonction pour generer un id  
async function generateID(length){
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ID = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    ID += chars[randomIndex];
  }
  return ID.toString();

}
const ChefDepartContro={
    //ajout amnuelle des ensiegnants 
AjouteEnseignant: async (req, res) => {
  const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });
  if (!chefDepart) {
    return res.status(404).json({ error: "chefDepart introuvable!" });
  }

        const saltRounds=10;
        const salt = await bcrypt.genSalt(saltRounds);
        const password= await generateRandomPassword(12);
        const MDP=password.toString();
        const hashedpassword =  await bcrypt.hash(MDP, salt);
        const hashedPassword = hashedpassword.toString();
        const Today = new Date();
        id=await generateID(8);
        const InfoEnseignant = {
          EnseignantID:id,
          Nom: req.body.Nom,
          Prenom: req.body.Prenom,
          Email: req.body.Email,
          Telephone: req.body.Telephone,
          Departement: req.body.Departement,
          Spécialité:req.body.Spécialité,
          MotDePasse: hashedPassword,
          verif: Today,
      
        };
        try {
          const enseignant = await Enseignant.findOne({ Email: req.body.Email });
          JSON.parse(JSON.stringify(enseignant));
          if (enseignant) {
            return res.status(409).json({ error: "l'enseignant existe déjà!" });
          }
          const newEnseignant = new Enseignant(InfoEnseignant);
          const savedEnseignant = await newEnseignant.save();
          const payload = {Email: req.body.Email};
          const token = jwt.sign(payload, JWT_SECRET, {expiresIn:"360000"});
          const transporter = nodemailer.createTransport({
            service:"Gmail",
            auth:{
              user:EmailAPP,
              pass:AppPass,
            },
          });
          const mailOptions = {
            from: EmailAPP,
            to: savedEnseignant.Email,
            subject: "Information compte",
            html: `
              <html>
                <head>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      background-color: #f2f2f2;
                    }
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #ffffff;
                      border: 1px solid #dddddd;
                      border-radius: 5px;
                    }
                    .header {
                      text-align: center;
                      margin-bottom: 20px;
                    }
                    h1 {
                      color: #333333;
                      font-size: 24px;
                      margin: 0;
                    }
                    .content {
                      color: #555555;
                      font-size: 16px;
                      line-height: 1.5;
                      text-align: left;
                    }
                    .password {
                      color: #ff6600;
                      font-size: 18px;
                      margin-top: 20px;
                      margin-bottom: 30px;
                      text-align: center;
                    }
                    .footer {
                      text-align: center;
                      color: #999999;
                      font-size: 14px;
                      margin-top: 30px;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Bienvenue dans GradGo</h1>
                    </div>
                    <div class="content">
                      <p>Bonjour Mr/Mme ${savedEnseignant.Nom} ${savedEnseignant.Prenom},</p>
                      <p>Votre mot de passe est :</p>
                      <p class="password"><strong>${MDP}</strong></p>
                      <p>Nous vous recommandons de changer votre mot de passe dès votre première connexion.</p>
                      <p>Merci de rejoindre GradGo, la plateforme de gestion de PFE.</p>
                    </div>
                    <div class="footer">
                      <p>Cet e-mail a été envoyé automatiquement, veuillez ne pas y répondre.</p>
                    </div>
                  </div>
                </body>
              </html>
            `
          };
          transporter.sendMail(mailOptions , (error , info)=>{
            if(error){
              console.log(error);
              return res.status(500).json({error:"Une erreur occure lors de de l'envoi de mail"});
            } else{
              console.log("Email envoyé :" +info.response);
              res.status(200).json({ status : savedEnseignant.Nom + "  " +"est  ajouté(e) avec succés"});
            }
          });
         
      }
       catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
      }
    },
//Ajout manuelle de l'etudiant
AjouterEtudiant: async (req, res) => {
  const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });
  if (!chefDepart) {
    return res.status(404).json({ error: "chefDepart introuvable!" });
  }
        const saltRounds=10;
        const salt = await bcrypt.genSalt(saltRounds);
        const password= await generateRandomPassword(12);
        const MDP=password.toString();
        const hashedpassword =  await bcrypt.hash(MDP, salt);
        const hashedPassword = hashedpassword.toString();
        const Today = new Date();
        JSON.parse(JSON.stringify(MDP));
        id=await generateID(8); 
        const InfoEtudiant = {
          EtudiantID:id,
          Nom: req.body.Nom,
          Prenom: req.body.Prenom,
          Email: req.body.Email,
          Departement: req.body.Departement,
          Filiere: req.body.Filiere,
          Niveau:req.body.Niveau,
          MotDePasse: hashedPassword,
          verif: Today,
          active: false,
        };
      
        try {
          const etudiant = await Etudiant.findOne({ Email: req.body.Email} );
          JSON.parse(JSON.stringify(etudiant));
          if (etudiant) {
            return res.status(409).json({ error: "L'utilisateur existe déjà!" });
          }
         
          const newEtudiant = new Etudiant(InfoEtudiant);
          const savedEtudiant = await newEtudiant.save();
          const payload = {Email: req.body.Email};
          const token = jwt.sign(payload, JWT_SECRET, {expiresIn:"360000"});
          const transporter = nodemailer.createTransport({
            service:"Gmail",
            auth:{
              user:EmailAPP,
              pass:AppPass,
            },
          });
          const mailOptions = {
            from: EmailAPP,
            to: savedEtudiant.Email,
            subject: "Information compte",
            html: `
              <html>
                <head>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      background-color: #f2f2f2;
                    }
                    .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #ffffff;
                      border: 1px solid #dddddd;
                      border-radius: 5px;
                    }
                    .header {
                      text-align: center;
                      margin-bottom: 20px;
                    }
                    h1 {
                      color: #333333;
                      font-size: 24px;
                      margin: 0;
                    }
                    .content {
                      color: #555555;
                      font-size: 16px;
                      line-height: 1.5;
                      text-align: left;
                    }
                    .password {
                      color: #ff6600;
                      font-size: 18px;
                      margin-top: 20px;
                      margin-bottom: 30px;
                      text-align: center;
                    }
                    .footer {
                      text-align: center;
                      color: #999999;
                      font-size: 14px;
                      margin-top: 30px;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Bienvenue dans GradGo</h1>
                    </div>
                    <div class="content">
                      <p>Bonjour  ${savedEtudiant.Nom} ${savedEtudiant.Prenom},</p>
                      <p>Votre mot de passe est :</p>
                      <p class="password"><strong>${MDP}</strong></p>
                      <p>Nous vous recommandons de changer votre mot de passe dès votre première connexion.</p>
                      <p>Merci de rejoindre GradGo, la plateforme de gestion de PFE.</p>
                    </div>
                    <div class="footer">
                      <p>Cet e-mail a été envoyé automatiquement, veuillez ne pas y répondre.</p>
                    </div>
                  </div>
                </body>
              </html>
            `
          };
          transporter.sendMail(mailOptions , (error , info)=>{
            if(error){
              console.log(error);
              return res.status(500).json({error:"Une erreur occure lors de de l'envoi de mail"});
            } else{
              console.log("Email envoyé :" +info.response);
              res.status(200).json({ status : savedEtudiant.Nom + "  " +"est  ajouté(e) avec succés"});
            }
          });
        } catch (err) {
          console.log(err);
          res.status(500).json({ error: err });
        }
},    
// ajout pa fichier json ou csv      
GetEtudiant: async function(req, res) {//get etudiantbyID
  const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });
  if (!chefDepart) {
    return res.status(404).json({ error: "chefDepart introuvable!" });
  }
        try {
          const etudiant = await Etudiant.findOne({EtudiantID:req.params.EtudiantID });
          if (!etudiant) {
            return res.status(404).json({ message: "L'étudiant n'existe pas" });
          }
          const { Nom, Prenom, Email, Departement, Filiere, Niveau } = etudiant;
          res.status(200).json({ Nom, Prenom, Email, Departement, Filiere, Niveau  });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Erreur lors de la récupération de l'étudiant" });
        }
},
GetEnseignant: async function(req, res) {//get enseignantbyID
        
  try {
    const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });
  if (!chefDepart) {
    return res.status(404).json({ error: "chefDepart introuvable!" });
  }
    const enseignant = await Enseignant.findOne({EnseignantID:req.params.EnseignantID});
    if (!enseignant) {
      return res.status(404).json({ message: "L'étudiant n'existe pas" });
    }
    const { Nom, Prenom, Email,Téléphone ,Departement, Spécialité } = enseignant;
    res.status(200).json({ Nom, Prenom, Email, Téléphone,Departement,Spécialité });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'enseignant" });
  }
},  
//get all student  
GetEtudiants: async function(req, res) {
        try {
          const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });
          if (!chefDepart) {
            return res.status(404).json({ error: "chefDepart introuvable!" });
          }
                const etudiants = await Etudiant.find({Departement: chefDepart.Departement });
                const etudiantsProfiles = etudiants.map(etudiant => {
                    const { Nom, Prenom, Email, Departement, Filiere, Niveau,Stage } = etudiant;
                    return { Nom, Prenom, Email, Departement, Filiere, Niveau,Stage };
                });
                res.status(200).json(etudiantsProfiles);
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Erreur lors de la récupération des étudiants" });
            }
},  
GetEnseignants: async function(req, res) {
  try { const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });
  if (!chefDepart) {
    return res.status(404).json({ error: "chefDepart introuvable!" });
  }
          const enseignants = await Enseignant.find({ Departement: chefDepart.Departement });
          const enseignantsProfiles = enseignants.map(enseignant => {
              const { EnseignantID,Nom, Prenom, Email,Telephone , Spécialité } = enseignant;
              return { EnseignantID,Nom, Prenom, Email, Telephone, Spécialité };
          });
          res.status(200).json(enseignantsProfiles);
      } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Erreur lors de la récupération des enseignants" });
      }
},       
// Modifier etudiant 
GetEtudiantsAvecStatus: async function(req, res) {
  try {
    const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });
    if (!chefDepart) {
      return res.status(404).json({ error: "chefDepart introuvable!" });
    }

    const etudiants = await Etudiant.find({ Departement: chefDepart.Departement });
    const etudiantsProfiles = await Promise.all(etudiants.map(async etudiant => {
      const { EtudiantID, Nom, Prenom, Email,  Filiere,Niveau } = etudiant;
      
      // Vérifier si l'étudiant est affecté à un stage
      const stage = await Stage.findOne({ EtudiantID });
      const statutEncadrement = stage ? "Affecté" : "Non affecté";

      return { EtudiantID, Nom, Prenom, Email, Filiere,Niveau, StatutEncadrement: statutEncadrement };
    }));

    res.status(200).json(etudiantsProfiles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération des étudiants" });
  }
},
UpdateEtudiantByID: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    const updateData = req.body;

    if (!etudiant) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    etudiant.Nom = updateData.Nom || etudiant.Nom;
    etudiant.Prenom = updateData.Prenom || etudiant.Prenom;
    etudiant.Email = updateData.Email || etudiant.Email;
    etudiant.Niveau = updateData.Niveau || etudiant.Niveau;

    await etudiant.save();

    return res.status(200).json({ message: "Étudiant mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de l'étudiant" });
  }
},
ModifierEtudiant: async function(req, res) {
  const { EtudiantID } = req.params;
  const newData = req.body; // Nouvelles données à mettre à jour pour l'étudiant

  try {
    const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });

    if (!chefDepart) {
      return res.status(404).json({ error: "Chef de départ introuvable!" });
    }
    const result = await Etudiant.updateOne({ EtudiantID }, { $set: newData });

    if (result.nModified === 0) {
      return res.status(404).json({ message: "Aucun étudiant n'a été mis à jour" });
    }

    res.status(200).json({ message: "L'étudiant a été mis à jour avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'étudiant" });
  }
},
UpdateEnseignantByID: async function(req, res) {
  try {
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
    const updateData = req.body;

    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }

    enseignant.Nom = updateData.Nom || enseignant.Nom;
    enseignant.Prenom = updateData.Prenom || enseignant.Prenom;
    enseignant.Email = updateData.Email || enseignant.Email;
    enseignant.Telephone = updateData.Telephone || enseignant.Telephone;

    await enseignant.save();

    return res.status(200).json({ message: "Enseignant mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de l'enseignant" });
  }
},
// supprimer etudiant    
supprimerEtudiantById: async function(req, res) {
  try {
      const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
      if (!etudiant) {
          return res.status(404).json({ message: "L'étudiant n'existe pas" });
      }
      await Etudiant.deleteOne({ EtudiantID: req.params.EtudiantID });
      res.status(200).json({ message: "L'étudiant a été supprimé avec succès" });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur lors de la suppression de l'étudiant" });
  }
},
//suppression de l'enseignant par id 
supprimerEnseignantById: async function(req, res) {
  try {
    const chefDepart = await ChefDepart.findOne({ChefDepartID : req.params.ChefDepartID});
    if(!chefDepart){
      return res.status(404).json({ message: "L'enseignant n'existe pas" });
    }
      const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
      if (!enseignant) {
          return res.status(404).json({ message: "L'enseignant n'existe pas" });
      }
      await Enseignant.deleteOne({ EnseignantID: req.params.EnseignantID });
      res.status(200).json({ message: "L'enseignant a été supprimé avec succès" });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur lors de la suppression de l'enseignant" });
  }
},
// supprimer le tout 
supprimerTousEtudiants: async function(req, res) {
    try {
        const result = await Etudiant.deleteMany({});
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Aucun étudiant n'a été supprimé" });
        }
        res.status(200).json({ message: "Tous les étudiants ont été supprimés avec succès" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la suppression des étudiants" });
    }
},
// affecter etudiant pas encore affecté a un encadrant
AffecterEtudiant: async function (req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
    const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });

    if (!etudiant || !enseignant || !chefDepart) {
      return res.status(404).json({ error: "L'étudiant, l'enseignant ou le chef de départ est introuvable!" });
    }

    // Vérifier si l'enseignant a des stages
    const stages = await Stage.find({ EnseignantID: req.params.EnseignantID });
    if (stages.length === 0) {
      return res.status(400).json({ error: "L'enseignant n'a pas de stages disponibles!" });
    }

    // Choix aléatoire d'un stage parmi ceux de l'enseignant
    const randomIndex = Math.floor(Math.random() * stages.length);
    const randomStage = stages[randomIndex];

    // Vérifier si l'étudiant n'est pas déjà affecté à un encadrant
    const existingStage = await Stage.findOne({ EtudiantID: req.params.EtudiantID });
    if (existingStage) {
      return res.status(400).json({ error: "L'étudiant est déjà affecté à un encadrant!" });
    }

    // Affecter l'étudiant au stage choisi aléatoirement et enregistrer les modifications
    randomStage.EtudiantID = req.params.EtudiantID;
    await randomStage.save();

    // Envoyer un email de confirmation à l'étudiant
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EmailAPP,
        pass: AppPass,
      },
    });

    const mailOptions = {
      from: EmailAPP,
      to: etudiant.Email,
      subject: 'Affectation à un encadrant',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
          <div style="background-color: #fff; border-radius: 5px; padding: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Affectation à un encadrant</h2>
            <p style="margin-bottom: 10px;">Cher(e) ${etudiant.Prenom} ${etudiant.Nom},</p>
            <p style="margin-bottom: 10px;">Nous sommes heureux de vous informer que vous avez été affecté(e) à l'encadrant universitaire ${enseignant.Nom} par ${chefDepart.Nom} pour le stage ${randomStage.NomStage}. Nous espérons que cette collaboration sera fructueuse pour votre projet de fin d'études.</p>
            <h3 style="color: #333; margin-bottom: 10px;">Informations sur le stage :</h3>
            <table style="border-collapse: collapse; width: 100%;">
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px;">Titre</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Description</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Technologie</th>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${randomStage.Titre}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${randomStage.Description}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${randomStage.Technologie}</td>
              </tr>
            </table>
            <p style="margin-bottom: 10px;">N'hésitez pas à contacter ${enseignant.Nom} si vous avez des questions ou besoin de conseils.</p>
            <p style="margin-bottom: 10px;">Cordialement,</p>
            <p style="margin-bottom: 0;">L'équipe de gestion des stages</p>
          </div>
        </div>
      `
    };
    

    const mailOptionsEnseignant = {
      from: EmailAPP,
      to: enseignant.Email,
      subject: "Affectation d'un étudiant",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
          <div style="background-color: #fff; border-radius: 5px; padding: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Affectation d'un étudiant</h2>
            <p style="margin-bottom: 10px;">Bonjour ${enseignant.Prenom} ${enseignant.Nom},</p>
            <p style="margin-bottom: 10px;">Vous avez été affecté(e) à encadrer l'étudiant ${etudiant.Prenom} ${etudiant.Nom}. Veuillez contacter l'étudiant pour organiser votre première rencontre et discuter du projet de fin d'études.</p>
            
            <h3 style="color: #333; margin-bottom: 10px;">Informations sur le stage :</h3>
            <table style="border-collapse: collapse; width: 100%;">
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px;">Titre</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Description</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Technologie</th>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${randomStage.Titre}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${randomStage.Description}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${randomStage.Technologie}</td>
              </tr>
            </table>
            
            <p style="margin-bottom: 10px;">Cordialement,</p>
            <p style="margin-bottom: 0;">L'équipe de gestion des stages</p>
          </div>
        </div>
      `
    };
    
    

    transporter.sendMail(mailOptionsEnseignant, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent to teacher: ' + info.response);
      }
    });

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return res.status(200).json({ message: "L'étudiant a été affecté à l'encadrant avec succès!" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Une erreur s'est produite lors de l'affectation de l'étudiant!" });
  }
},


GetEtudiantAffe: async function (req, res) {
  try {
    const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });

    if (!chefDepart) {
      return res.status(404).json({ error: "Chef de départ introuvable!" });
    }

    // Récupérer tous les enseignants liés au chef de départ
    const enseignants = await Enseignant.find({ Departement: chefDepart.Departement });

    // Préparer le résultat
    const result = [];

    for (const enseignant of enseignants) {
      // Récupérer les étudiants encadrés par l'enseignant
      const stages = await Stage.find({ EnseignantID: enseignant.EnseignantID });

      for (const stage of stages) {
        if (stage.EtudiantID) {
          const etudiant = await Etudiant.findOne({ EtudiantID: stage.EtudiantID });

          if (etudiant) {
            const etudiantData = {
              EtudiantID:etudiant.EtudiantID,
              Nom: etudiant.Nom,
              Prenom: etudiant.Prenom,
              Filiere: etudiant.Filiere,
              Niveau :etudiant.Niveau,
              Titre: stage.Titre,
                DateFin: stage.DateFin,
                StatutEncadrement: "Affecté"
            };

            result.push(etudiantData);
          }
        }
      }
    }

    // Retourner la liste des étudiants avec leurs informations
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des encadrants avec les étudiants!" });
  }
},
// get etudiant non affectés :
getEtudiantNonAffecte: async function (req, res) {
  try {
    // Récupérer le chef de départ
    const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });

    if (!chefDepart) {
      return res.status(404).json({ error: "Chef de départ introuvable!" });
    }

    // Récupérer tous les étudiants
    const etudiants = await Etudiant.find();

    const etudiantsNonAffectes = [];

    for (const etudiant of etudiants) {
      // Vérifier si l'étudiant est affecté à un enseignant
      const stage = await Stage.findOne({ EtudiantID: etudiant.EtudiantID });

      if (!stage || !stage.EnseignantID) {
        const etudiantData = {
          EtudiantID: etudiant.EtudiantID,
          Nom: etudiant.Nom,
          Prenom: etudiant.Prenom,
          Email : etudiant.Email,
          Filiere: etudiant.Filiere,
          Niveau : etudiant.Niveau,
          StatutEncadrement: "Non affecté"
        };

        etudiantsNonAffectes.push(etudiantData);
      }
    }

    // Retourner la liste des étudiants non affectés
    return res.status(200).json(etudiantsNonAffectes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des étudiants non affectés!" });
  }
},
//stastique
GetEtudiantsAvecStatusStats: async function(req, res) {
  try {
    const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });
    if (!chefDepart) {
      return res.status(404).json({ error: "chefDepart introuvable!" });
    }

    const etudiants = await Etudiant.find({ Departement: chefDepart.Departement });
    const etudiantsProfiles = await Promise.all(etudiants.map(async etudiant => {
      const { EtudiantID, Nom, Prenom, Email, Filiere, Niveau } = etudiant;
      
      // Vérifier si l'étudiant est affecté à un stage
      const stage = await Stage.findOne({ EtudiantID });
      const statutEncadrement = stage ? "Affecté" : "Non affecté";

      return { EtudiantID, Nom, Prenom, Email, Filiere, Niveau, StatutEncadrement: statutEncadrement };
    }));

    const nbEtudiantsTotal = etudiantsProfiles.length;
    const nbEtudiantsAffectes = etudiantsProfiles.filter(etudiant => etudiant.StatutEncadrement === "Affecté").length;
    const nbEtudiantsNonAffectes = etudiantsProfiles.filter(etudiant => etudiant.StatutEncadrement === "Non affecté").length;

    const result = {
      Etudiants: etudiantsProfiles,
      NombreEtudiantsTotal: nbEtudiantsTotal,
      NombreEtudiantsAffectes: nbEtudiantsAffectes,
      NombreEtudiantsNonAffectes: nbEtudiantsNonAffectes
    };

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération des étudiants" });
  }
},
GetNombreEtudiantsEnseignantsParDepartement: async function(req, res) {
  try {
    const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });

    if (!chefDepart) {
      return res.status(404).json({ error: "chefDepart introuvable!" });
    }

    const departement = chefDepart.Departement;
    const nbEtudiants = await Etudiant.countDocuments({ Departement: departement });
    const nbEnseignants = await Enseignant.countDocuments({ Departement: departement });

    res.status(200).json({
      Departement: departement,
      NombreEtudiants: nbEtudiants,
      NombreEnseignants: nbEnseignants
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération du nombre d'étudiants et d'enseignants par département" });
  }
},






  
  
  
      
  





}
module.exports= ChefDepartContro;