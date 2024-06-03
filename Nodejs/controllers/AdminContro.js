const bcrypt = require("bcrypt");
const ChefDepart = require('../models/ChefDepart');
const Admin = require('../models/Admin');
const Etudiant = require('../models/Etudiant');
const Enseignant = require('../models/Enseignant');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const JWT_SECRET = "k1h8s270AR3B9h0"; 
const AppPass="zpzjmvdyannqxrsl";
const EmailAPP="gogradpfe@gmail.com";
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
const AdminContro={
AjouteChefDepart: async (req, res) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const password = await generateRandomPassword(12);
    const hashedpassword = await bcrypt.hash(password, salt);
    const MDP=password.toString();
    const Today = new Date();
    const id = await generateID(8);
  
    const InfoChefDepart = {
      ChefDepartID: id,
      Nom: req.body.Nom,
      Prenom: req.body.Prenom,
      Email: req.body.Email,
      Téléphone: req.body.Téléphone,
      Departement: req.body.Departement,
      MotDePasse: hashedpassword,
      verif: Today,
    };
  
    try {
      const chefDepart = await ChefDepart.findOne({ Email: req.body.Email });
  
      if (chefDepart) {
        return res.status(409).json({ error: "Cet email existe déjà!" });
      }
  
      const newChefDepart = new ChefDepart(InfoChefDepart);
      const savedChefDepart = await newChefDepart.save();
  
      const payload = { Email: req.body.Email };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "360000" });
  
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: EmailAPP,
          pass: AppPass,
        },
      });
      const mailOptions = {
          from: EmailAPP,
          to: savedChefDepart.Email,
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
                    <p>Bonjour Mr/Mme ${savedChefDepart.Nom} ${savedChefDepart.Prenom},</p>
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
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res
            .status(500)
            .json({ error: "Une erreur est survenue lors de l'envoi de l'email" });
        } else {
          console.log("Email envoyé :" + info.response);
          res.status(200).json({
            message: `${savedChefDepart.Nom} a été ajouté(e) avec succès!`,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
},
AjouteAdmin: async (req, res) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const password = await generateRandomPassword(12);
  const hashedpassword = await bcrypt.hash(password, salt);
  const MDP=password.toString();
  const Today = new Date();
  const id = await generateID(8);

  const InfoAdmin = {
    ChefDepartID: id,
    Nom: req.body.Nom,
    Prenom: req.body.Prenom,
    Email : req.body.Email,
    MotDePasse: hashedpassword,
    verif: Today,
  };

  try {
    const admin = await Admin.findOne({ Email: req.body.Email });

    if (admin) {
      return res.status(409).json({ error: "Cet email existe déjà!" });
    }

    const newAdmin = new Admin(InfoAdmin);
    const savedAdmin = await newAdmin.save();

    const payload = { Email: req.body.Email };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "360000" });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EmailAPP,
        pass: AppPass,
      },
    });
    const mailOptions = {
        from: EmailAPP,
        to: newAdmin.Email,
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
                  <p>Bonjour Mr/Mme ${newAdmin.Nom} ${newAdmin.Prenom},</p>
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

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ error: "Une erreur est survenue lors de l'envoi de l'email" });
      } else {
        console.log("Email envoyé :" + info.response);
        res.status(200).json({
          message: `${newadmin.Nom} a été ajouté(e) avec succès!`,
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
},
getChefDepart : async function(req,res){
  try {
    const chefDeparts = await ChefDepart.find({});
    const chefDepartsProfiles = chefDeparts.map(chefDepart => {
        const { ChefDepartID,Nom, Prenom, Email, Departement } = chefDepart;
        return { ChefDepartID,Nom, Prenom, Email, Departement };
    });
    res.status(200).json(chefDepartsProfiles);
} catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération des étudiants" });
}
},
UpdateChefDepartByID : async function(req,res){
  try {
    const chefDepart = await ChefDepart.findOne({ ChefDepartID: req.params.ChefDepartID });
    const updateData = req.body;

    if (!chefDepart) {
      return res.status(404).json({ message: "Chef département  non trouvé" });
    }

    chefDepart.Nom = updateData.Nom || chefDepart.Nom;
    chefDepart.Prenom = updateData.Prenom || chefDepart.Prenom;
    chefDepart.Email = updateData.Email || chefDepart.Email;
    chefDepart.Téléphone = updateData.Téléphone || chefDepart.Téléphone;

    await chefDepart.save();

    return res.status(200).json({ message: "Chef département mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour de l'enseignant" });
  }
},
getChefDepartByDep: async function(req, res) {
  try {
    const { Departement } = req.body;
    if (!Departement) {
      return res.status(400).json({ message: "Paramètre 'Departement' manquant dans la requête" });
    }
    const chefDeparts = await ChefDepart.find({ Departement: Departement });
    if (chefDeparts.length === 0) {
      return res.status(404).json({ message: `Aucun chef de département trouvé pour le département '${Departement}'` });
    }
    const chefDepartsProfiles = chefDeparts.map((chefDepart) => {
      const { ChefDepartID,Nom, Prenom, Email, Departement } = chefDepart;
      return { ChefDepartID,Nom, Prenom, Email, Departement };
    });
    res.status(200).json(chefDepartsProfiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Erreur lors de la récupération : ${error.message}` });
  }
},
// get all Etudiants
getEtudiants: async function(req, res) {
    try {
            const etudiants = await Etudiant.find({});
            const etudiantsProfiles = etudiants.map(etudiant => {
                const { EtudiantID,Nom, Prenom, Email, Departement, Filiere, Niveau,Stage } = etudiant;
                return { EtudiantID,Nom, Prenom, Email, Departement, Filiere, Niveau,Stage };
            });
            res.status(200).json(etudiantsProfiles);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur lors de la récupération des étudiants" });
        }
},  
getEtudiantByDep: async function(req, res) {
  try {
    const { Departement } = req.body;
    if (!Departement) {
      return res.status(400).json({ message: "Paramètre 'Departement' manquant dans la requête" });
    }
    const etudiant = await Etudiant.find({ Departement: Departement });
    if (etudiant.length === 0) {
      return res.status(404).json({ message: `Aucun chef de département trouvé pour le département '${Departement}'` });
    }
    const etudiantProfiles = etudiant.map((enseignant) => {
      const { EtudiantID,Nom, Prenom, Email, Departement } = enseignant;
      return { EtudiantID,Nom, Prenom, Email, Departement };
    });
    res.status(200).json(etudiantProfiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Erreur lors de la récupération : ${error.message}` });
  }
},
getEnseignantByDep: async function(req, res) {
  try {
    const { Departement } = req.body;
    if (!Departement) {
      return res.status(400).json({ message: "Paramètre 'Departement' manquant dans la requête" });
    }
    const enseignant = await Enseignant.find({ Departement: Departement });
    if (enseignant.length === 0) {
      return res.status(404).json({ message: `Aucun chef de département trouvé pour le département '${Departement}'` });
    }
    const enseignantProfiles = enseignant.map((enseignant) => {
      const { EnseignantID,Nom, Prenom, Email, Departement } = enseignant;
      return { EnseignantID,Nom, Prenom, Email, Departement };
    });
    res.status(200).json(enseignantProfiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Erreur lors de la récupération : ${error.message}` });
  }
},

SupprimerEtudiantById: async function(req, res) {
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
SupprimerEnseignantById: async function(req, res) {
  try {
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

}
module.exports= AdminContro;