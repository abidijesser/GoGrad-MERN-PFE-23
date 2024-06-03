const bcrypt = require("bcrypt");
const AppPass="zpzjmvdyannqxrsl";
const EmailAPP="gogradpfe@gmail.com";
const BASE_URL = 'http://localhost:8000';
const Etudiant = require('../models/Etudiant');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const Enseignant = require('../models/Enseignant');
const Encadrant = require("../models/Encadrant");
const nodemailer = require('nodemailer');
const multer = require('multer');
const Task = require('../models/Task');
const pdfMake = require('pdfmake'); 
const PDFDocument = require('pdfkit');
const Stage = require('../models/Stage');
const StatusEnum = require('../models/Etudiant');
const mongoose = require('mongoose');


const { uploadFile, saveFile }= require('../controllers/uploadFichier');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // specify the directory where files should be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // use the original filename with a timestamp
  },
});
const upload = multer({ storage: storage });
async function generatePDF(donneesStage) {
  const doc = new PDFDocument();

  // Définir le contenu du PDF
  doc
    .fontSize(16)
    .text('Cahier des charges', { align: 'center' })
    .fontSize(12)
    .text(`Sujet: ${donneesStage.Sujet}`)
    .text(`Encadrant universitaire: ${donneesStage.EncadrantUniversitaire || '-'}`)
    .text('Etablissement d\'accueil:')
    .text(`Nom: ${donneesStage.EtablissementAccueil.Nom || '-'}`)
    .text(`Responsable: ${donneesStage.EtablissementAccueil.Responsable || '-'}`)
    .text(`Encadrant professionnel: ${donneesStage.EtablissementAccueil.EncadrantProfessionnel || '-'}`)
    .text('Objectifs:')
    .text(donneesStage.Objectifs || '-')
    .text('Contraintes:')
    .text(donneesStage.Contraintes || '-')
    .text('Planning:')
    .text(donneesStage.Planning || '-');

  // Retourner le document PDF généré
  return doc;
}
//generate random password
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

async function sendEmail(to, subject, message) {
  // Configuration du transporteur de messagerie
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EmailAPP, 
      pass: AppPass 
    }
  });

  // Options de l'e-mail
  const mailOptions = {
    from: EmailAPP, 
    to: to,
    subject: subject,
    html: message
  };

  // Envoi de l'e-mail
  await transporter.sendMail(mailOptions);
}
const EtudiantContro = {
//methode pour enregister les donnees de stage dans la bd
enregistrerDonneesStage : async (etudiant, donneesStage) => {
  etudiant.Stage = donneesStage;
  const savedEtudiant = await etudiant.save();
  return savedEtudiant;
},
//upload cahier de charge 
uploadFile(req, res, callback) {
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/');
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
      }
    }),
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(txt|docx|odt|pdf|PDF)$/)) {
        return cb(new Error('Seuls les fichiers TXT, DOCX, ODT et PDF sont autorisés!'));
      }
      cb(null, true);
    }
  }).single('CahierCharge');

  upload(req, res, function (err) {
    callback(err);
  });
},
AjouterEncadrantPro : async function (req, res) {
  try {
    const { Email } = req.body;
    const { EtudiantID } = req.params;

    // Vérifier si l'étudiant existe
    const etudiant = await Etudiant.findOne({ EtudiantID });
    if (!etudiant) {
      return res.status(404).json({ message: "Etudiant non trouvé" });
    }

    // Vérifier si l'encadrant existe déjà
    let encadrant = await Encadrant.findOne({ Email });
    if (encadrant) {
      return res.status(400).json({ message: "L'encadrant existe déjà" });
    }

    // Générer un mot de passe aléatoire
    const password = await generateRandomPassword(12);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un ID pour l'encadrant
    const EncadrantID = await generateID(8);

    // Créer le compte encadrant
    encadrant = await Encadrant.create({
      Email,
      MotDePasse: hashedPassword,
      Etudiant: etudiant.EtudiantID,
      EncadrantID
    });

    // Mettre à jour l'objet EtablissementAccueil dans le modèle Stage avec l'encadrant professionnel
    const stage = await Stage.findOne({ EtudiantID });
    if (!stage) {
      return res.status(404).json({ message: "Stage non trouvé" });
    }
    stage.EtablissementAccueil.Encadrant = Encadrant.Email;
    await stage.save();

    // Envoyer l'email contenant les informations de connexion
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EmailAPP,
        pass: AppPass
      }
    });
    const emailOptions = {
      from: EmailAPP,
      to: Email,
      subject: "Informations de connexion - Plateforme de gestion de stage",
      text: `Bonjour,\n\nVous avez été ajouté en tant qu'encadrant du stage de ${etudiant.Nom}.\nVoici vos informations de connexion:\nEmail: ${Email}\nMot de passe: ${password}\n\nCordialement,\nL'équipe de la plateforme de gestion de stage`
    };
    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi du mail!" });
      } else {
        console.log("Email envoyé: " + info.response);
        return res.status(200).json({ status: "Email envoyé!" });
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout de l'encadrant professionnel." });
  }
},
getStage: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });

    if (!etudiant) {
      return res.status(404).json({ message: "Etudiant non trouvé" });
    }
    
    const stage = await Stage.findOne({ EtudiantID: req.params.EtudiantID })
      .populate('EncadrantID', 'Email')
      .populate('EnseignantID', 'Nom Prenom');
      

    if (!stage) {
      return res.status(404).json({ message: "Stage non trouvé" });
    }
    
    const encadrant = await Encadrant.findOne({ EncadrantID: stage.EncadrantID });
    
    const encadrantEmail = stage.EncadrantID ? encadrant.Email : "Non encore défini";
    const societe =  stage.Societe || "Non encore défini";

   
    const result = {
      EtudiantID: etudiant.EtudiantID,
      StageID: stage.StageID,
      Titre: stage.Titre,
      Description: stage.Description,
      Technologie: stage.Technologie,
      EncadrantProEmail: encadrantEmail,
      Societe: societe
    };
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
},
AjouterStage: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });

    if (!etudiant) {
      return res.status(404).json({ message: "Etudiant non trouvé" });
    }
     // Vérifier si l'étudiant a déjà un stage existant
     const stageExistant = await Stage.findOne({ EtudiantID: etudiant.EtudiantID });
     if (stageExistant) {
       return res.status(400).json({ message: "Vous ne pouvez ajouter qu'un seul stage" });
     }
 

    const nouveauStage = req.body;

    const stageID = (await generateID(6)).toString(); // Appeler la méthode generateID pour générer le stageID

    const nouveauStageObj = {
      StageID: stageID,
      EtudiantID: req.params.EtudiantID,
      Titre: nouveauStage.Titre,
      DateAjout: Date.now(),
      DateFin: nouveauStage.DateFin,
      Description: nouveauStage.Description,
      Technologie: nouveauStage.Technologie,
      EncadrementStatus: "En attente",
      Demande: false,
      ProposePar: "Etudiant",
      Societe: nouveauStage.Societe || "",
      Responsable: nouveauStage.Responsable || "",
      EncadrantProfessionnel: nouveauStage.EncadrantProfessionnel || ""
    };

    const stage = new Stage(nouveauStageObj);

    // Vérifier si l'encadrant existe déjà
    let encadrant;
    let password;

    if (nouveauStage.EncadrantProfessionnel) {
      encadrant = await Encadrant.findOne({ Email: nouveauStage.EncadrantProfessionnel });

      if (!encadrant) {
        // Générer un mot de passe aléatoire
        password = await generateRandomPassword(12);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Générer un ID pour l'encadrant
        const encadrantID = await generateID(8);

        // Créer le compte encadrant
        encadrant = await Encadrant.create({
          Email: nouveauStage.EncadrantProfessionnel,
          MotDePasse: hashedPassword,
          Etudiant: etudiant.EtudiantID,
          EncadrantID: encadrantID
        });

        // Mettre à jour le stage avec l'ID de l'encadrant
        stage.EncadrantID = encadrant.EncadrantID;
      }
    }

    await stage.save();
    etudiant.stages.push(mongoose.Types.stageID);
    await etudiant.save();

    // Envoyer l'email contenant les informations de connexion
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EmailAPP,
        pass: AppPass
      }
    });
    const emailOptions = {
      from: EmailAPP,
      to: encadrant ? encadrant.Email : "",
      subject: "Informations de connexion - Plateforme de gestion de stage",
      text: `Bonjour,\n\nVous avez été ajouté en tant qu'encadrant du stage de ${etudiant.Nom}.\nVoici vos informations de connexion:\nEmail: ${encadrant ? encadrant.Email : ""}\nMot de passe: ${password}\n\nCordialement,\nL'équipe de la plateforme de gestion de stage`
    };
    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi du mail!" });
      } else {
        console.log("Email envoyé: " + info.response);
        return res.status(200).json({ message: "Le stage a été ajouté avec succès" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout du stage" });
  }
},
// Modifier un stage
ModifieStage: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    const stageID = req.params.StageID;
    const updateData = req.body;

    if (!etudiant) {
      return res.status(404).json({ message: "Etudiant non trouvé" });
    }

    const stage = await Stage.findOne({ StageID: stageID });

    if (!stage) {
      return res.status(404).json({ message: "Stage non trouvé" });
    }

    if (stage.EtudiantID !== etudiant.EtudiantID) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce stage" });
    }

    if (etudiant.EncadrementStatus === StatusEnum.Accepte) {
      return res.status(403).json({ message: "Le stage ne peut pas être modifié car il a été accepté" });
    }

    if (etudiant.EncadrementStatus === StatusEnum.EnAttente) {
      return res.status(403).json({ message: "Le stage ne peut pas être modifié car une demande a été envoyée" });
    }

    stage.Titre = updateData.Titre || stage.Titre;
    stage.Technologie = updateData.Technologie || stage.Technologie;
    stage.Description = updateData.Description || stage.Description;
    stage.DateFin = updateData.DateFin || stage.DateFin;
    stage.DateAjout = updateData.DateAjout || stage.DateAjout;

    let encadrant;
    let password;

    if (updateData.EncadrantProfessionnel) {
      encadrant = await Encadrant.findOne({ Email: updateData.EncadrantProfessionnel });

      if (!encadrant) {
        // Générer un mot de passe aléatoire
        password = await generateRandomPassword(12);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Générer un ID pour l'encadrant
        const encadrantID = await generateID(8);

        // Créer le compte encadrant
        encadrant = await Encadrant.create({
          Email: updateData.EncadrantProfessionnel,
          MotDePasse: hashedPassword,
          Etudiant: etudiant.EtudiantID,
          EncadrantID: encadrantID
        });

        // Mettre à jour le stage avec l'ID de l'encadrant
        stage.EncadrantProfessionnel = encadrant.Email;
        stage.EncadrantID = encadrant.EncadrantID;
      }
    }

    await stage.save();

    // Envoyer l'email contenant les informations de connexion
    if (encadrant && password) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: EmailAPP,
          pass: AppPass
        }
      });
      const emailOptions = {
        from: EmailAPP,
        to: encadrant.Email,
        subject: "Informations de connexion - Plateforme de gestion de stage",
        text: `Bonjour,\n\nVous avez été ajouté en tant qu'encadrant du stage de ${etudiant.Nom}.\nVoici vos informations de connexion:\nEmail: ${encadrant.Email}\nMot de passe: ${password}\n\nCordialement,\nL'équipe de la plateforme de gestion de stage`
      };
      transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi du mail!" });
        }
        return res.status(200).json({ message: "Le stage a été modifié avec succès" });
      });
    } else {
      return res.status(200).json({ message: "Le stage a été modifié avec succès" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de la modification du stage" });
  }
},
GetStagesByEnseignantID: async function (req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    if (!etudiant) {
      return res.status(404).json({ message: "Etudiant non trouvé" });
    }

    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }

    const stages = await Stage.find({ EnseignantID: req.params.EnseignantID, EtudiantID: { $exists: false } }, { _id: 0, Titre: 1, StageID: 1 ,Description:1,Technologie:1});

    if (stages.length === 0) {
      return res.status(200).json({ message: "L'enseignant n'a pas de stages proposés ou tous les stages sont affectés à des étudiants" });
    }

    return res.status(200).json(stages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
},


DemanderEncadrement: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });

    if (!etudiant || !enseignant) {
      return res.status(404).json({ error: "L'étudiant ou l'enseignant est introuvable!" });
    }
    
    // Vérifier si l'étudiant et l'enseignant ont le même département
    if (etudiant.Departement !== enseignant.Departement) {
      return res.status(400).json({ error: "L'étudiant et l'enseignant n'appartiennent pas au même département!" });
    }

    const stage = await Stage.findOne({ EtudiantID: etudiant.EtudiantID });

    if (!stage) {
      return res.status(404).json({ error: "Vous devez d'abord déposer votre stage ou choisissez un parmi les offres proposées" });
    }
    if (stage.EtudiantID && stage.EnseignantID) {
      return res.status(400).json({ error: "Vous avez déjà été accepté(e) pour un stage et ne pouvez pas envoyer une autre demande d'encadrement." });
    }
    
    const currentTime = new Date();
    const expirationDate = new Date(etudiant.validationCodeExpiration || 0);

    if (expirationDate > currentTime) {
      return res.status(400).json({ error: "Vous avez déjà envoyé une demande dans les 72 heures!" });
    }

    etudiant.EncadrementStatus = StatusEnum.EnAttente;
    stage.DateAjout = new Date();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EmailAPP,
        pass: AppPass,
      }
    });

    const mailOptions = {
      from: etudiant.Email,
      to: enseignant.Email,
      subject: "Demande d'encadrement",
      html: `
      Bonjour Mr/Mme ${enseignant.Nom},<br><br>
      Je suis ${etudiant.Nom} ${etudiant.Prenom} inscrit(e) en ${etudiant.Filiere}${etudiant.Niveau}.<br>
      Je vous contacte aujourd'hui afin de solliciter votre encadrement pour mon stage.<br>
      Voici les informations relatives à mon stage :<br><br>
      <table style="border-collapse: collapse;">
        <tr>
          <th style="border: 1px solid black; padding: 8px;">Titre</th>
          <th style="border: 1px solid black; padding: 8px;">Technologie</th>
          <th style="border: 1px solid black; padding: 8px;">Description</th>
          <th style="border: 1px solid black; padding: 8px;">Date de début</th>
          <th style="border: 1px solid black; padding: 8px;">Date de fin</th>
        </tr>
        <tr>
          <td style="border: 1px solid black; padding: 8px;">${stage.Titre}</td>
          <td style="border: 1px solid black; padding: 8px;">${stage.Technologie}</td>
          <td style="border: 1px solid black; padding: 8px;">${stage.Description}</td>
          <td style="border: 1px solid black; padding: 8px;">${stage.DateDebut}</td>
          <td style="border: 1px solid black; padding: 8px;">${stage.DateFin}</td>
        </tr>
      </table>
      <br>
      Je pense que votre expérience et vos connaissances pourraient m'être très utiles pour mener à bien ce projet.<br><br>
      Je suis conscient(e) que votre temps est précieux, mais si vous pouviez m'accorder quelques minutes pour discuter avec moi de mon projet et de vos attentes en tant qu'encadrant,
      cela me serait d'une grande joie.<br><br>
      Je vous remercie d'avance pour votre considération et j'espère avoir l'opportunité de travailler avec vous.<br><br>
      <div style="text-align: center;">
        <a id="accepterBtn" href="${BASE_URL}/Enseignant/gererDemande/${etudiant.EtudiantID}/${enseignant.EnseignantID}?action=accepter" style="display: inline-block; margin: 10px; padding: 10px 20px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 5px;">Accepter</a>
        <a id="refuserBtn" href="${BASE_URL}/Enseignant/gererDemande/${etudiant.EtudiantID}/${enseignant.EnseignantID}?action=refuser" style="display: inline-block; margin: 10px; padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px;">Refuser</a>
      </div>
    `};

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi de la demande!" });
      } else {
        console.log('Email envoyé: ' + info.response);

        // Mettre à jour la date d'expiration de la demande
        etudiant.validationCodeExpiration = new Date().setHours(currentTime.getHours() + 72);

        await etudiant.save();
        await stage.save();

        return res.status(200).json({ message: "La demande a été envoyée avec succès!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi de la demande!" });
  }
},

DemanderStage: async function (req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
    const Intern = await Stage.findOne({ EtudiantID: req.params.EtudiantID, EnseignantID: req.params.EnseignantID });  
    const stage = await Stage.findOne({StageID:req.params.StageID});
    if (!stage) {
      return res.status(404).json({ error: "Le stage est introuvable!" });
    }
    if (Intern && Intern.StageID !== req.params.StageID) {
      return res.status(403).json({ error: "L'étudiant ne peut pas demander un autre stage car il est déjà affecté à un stage!" });
    }
    if (!etudiant || !enseignant) {
      return res.status(404).json({ error: "L'étudiant ou l'enseignant est introuvable!" });
    }
    if (etudiant.Departement !== enseignant.Departement) {
      return res.status(400).json({ error: "L'étudiant et l'enseignant n'appartiennent pas au même département!" });
    }
    // Vérifier si le stage est déjà affecté à un autre étudiant
    const otherStudent = await Stage.findOne({ StageID: req.params.StageID, EtudiantID: { $ne: req.params.EtudiantID, $exists: true } });

if (otherStudent) {
  return res.status(403).json({ error: "Le stage est déjà affecté à un autre étudiant!" });
}

    if (etudiant.EncadrementStatus === StatusEnum.Accepte ) {
      return res.status(403).json({ message: "Le stage ne peut pas être modifié car il a été accepté " });
    }
  
    const currentTime = new Date();
    const expirationDate = new Date(etudiant.validationCodeExpiration || 0);

    if (expirationDate > currentTime) {
      return res.status(400).json({ error: "Vous avez déjà envoyé une demande dans les 72 heures!" });
    }


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EmailAPP,
        pass: AppPass,
      }
    });

    const mailOptions = {
      from: etudiant.Email,
      to: enseignant.Email,
      subject: "Demande de stage",
      html: `
      Bonjour Mr/Mme ${enseignant.Nom},<br><br>
      Je suis ${etudiant.Nom} ${etudiant.Prenom} inscrit(e) en ${etudiant.Filiere}${etudiant.Niveau}.<br>
      Je vous contacte aujourd'hui afin de solliciter votre stage intitulé "${stage.Titre}".<br>
      Je suis très intéressé(e) par ce sujet de stage et je pense que cela correspond parfaitement à mes objectifs et compétences.<br><br>
      Je serais ravi(e) de discuter davantage des détails du stage et de mes motivations lors d'un entretien.<br><br>
      Je vous remercie d'avance pour votre considération et j'espère avoir l'opportunité de réaliser ce stage avec vous.<br><br>
      <div style="text-align: center;">
        <a href="${BASE_URL}/Enseignant/gererDemandeStage/${etudiant.EtudiantID}/${enseignant.EnseignantID}/${stage.StageID}?action=accepter" style="display: inline-block; margin: 10px; padding: 10px 20px; background-color: #4caf50; color: white; text-decoration: none; border-radius: 5px;">Accepter</a>
        <a href="${BASE_URL}/Enseignant/gererDemandeStage/${etudiant.EtudiantID}/${enseignant.EnseignantID}/${stage.StageID}?action=refuser" style="display: inline-block; margin: 10px; padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 5px;">Refuser</a>
      </div>
    `
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi de la demande!" });
      } else {
        console.log('Email envoyé: ' + info.response);

        etudiant.Demande = true;
        etudiant.EncadrementStatus = StatusEnum.EnAttente; // Ajoutez cette ligne pour mettre à jour le champ EncadrementStatus

        etudiant.validationCodeExpiration = new Date();
        etudiant.validationCodeExpiration.setHours(etudiant.validationCodeExpiration.getHours() + 72);

        await etudiant.save();

        return res.status(200).json({ message: "La demande a été envoyée avec succès!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi de la demande!" });
  }
},

GetEnseignants: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });

    if (!etudiant ) {
      return res.status(404).json({ error: "L'étudiant est introuvable!" });
    }
      const enseignants = await Enseignant.find({ Departement: etudiant.Departement });
      const enseignantsProfiles = enseignants.map(enseignant => {
          const { EnseignantID,Nom, Prenom, Email, Téléphone, Departement, Spécialité } = enseignant;
          return { EnseignantID,Nom, Prenom, Email, Téléphone, Departement, Spécialité };
      });
      res.status(200).json(enseignantsProfiles);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur lors de la récupération des enseignants" });
  }
},


// gestion de tache 

CreateTask: async function(req, res) {
  const EtudiantID = req.params.EtudiantID;
  const {  Nom ,DateÉcheance } = req.body;

  try {
    const etudiant = await Etudiant.findOne({ EtudiantID });
    if (!etudiant) {
      throw new Error("Étudiant non trouvé");
    }

    // Vérification des doublons de tâches
    const tacheExistante = await Task.findOne({ Nom, EtudiantID });
    if (tacheExistante) {
      throw new Error("Une tâche avec le même nom existe déjà pour cet étudiant");
    }

    // Upload du fichier
    await new Promise((resolve, reject) => {
      upload.single("Fichier")(req, res, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    const id = await generateID(8);
    const TaskInfo = {
      TaskID: id,
      EtudiantID,
      Nom,
      Fichier: req.file ? req.file.path : null,
      DateAjout: Date.now(),
      DateÉcheance,
    };
    const nouvelleTache = await Task.create(TaskInfo);

    etudiant.taches.push(nouvelleTache._id);
    await etudiant.save();

    if (req.file) {
      await saveFile(etudiant, req.file);
    }

    res.status(201).json({ message: "Tâche créée avec succès!", TaskInfo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la création de la tâche!" });
  }
},
// get tasks
GetTasks: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.body.EtudiantID });
    if (!etudiant) {
      return res.status(404).json({ error: "Etudiant introuvable!" });
    }
    if (!etudiant.taches) {
      return res.status(404).json({ error: "Aucune tâche trouvée!" });
    }
    const taches = await Task.find({ EtudiantID: etudiant.EtudiantID }, { Nom: 1, Fichier: 1 });
    if (taches.length === 0) {
      return res.status(404).json({ error: "Aucune tâche trouvée!" });
    }
    const tachesSimplifiees = taches.map(tache => ({ Nom: tache.Nom, Fichier: tache.Fichier }));
    res.status(200).json({ taches: tachesSimplifiees });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération des tâches!" });
  }
},
// get tasks par ordre alphabétique
GetTasksOA: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    if (!etudiant) {
      return res.status(404).json({ error: "Etudiant introuvable!" });
    }
    if (!etudiant.taches) {
      return res.status(404).json({ error: "Aucune tâche trouvée!" });
    }
    const taches = await Task.find({ EtudiantID: etudiant.EtudiantID }).sort({ Nom: 1 });
    if (taches.length === 0) {
      return res.status(404).json({ error: "Aucune tâche trouvée!" });
    }
    const tachesSimplifiees = taches.map(tache => ({ Nom: tache.Nom, Fichier: tache.Fichier }));
    res.status(200).json({ taches: tachesSimplifiees });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération des tâches!" });
  }
},
//get tasks by date asc
GetTasksByDateA: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    if (!etudiant) {
      return res.status(404).json({ error: "Etudiant introuvable!" });
    }
    if (!etudiant.taches) {
      return res.status(404).json({ error: "Aucune tâche trouvée!" });
    }
    const taches = await Task.find({ EtudiantID: etudiant.EtudiantID }).sort({ DateAjout: 1 });
    if (taches.length === 0) {
      return res.status(404).json({ error: "Aucune tâche trouvée!" });
    }
    const result = taches.map(({ Nom, Fichier }) => ({ Nom, Fichier }));
    res.status(200).json({ taches: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération des tâches!" });
  }
},
//get tasks by date desc
GetTasksByDateD: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    if (!etudiant) {
      return res.status(404).json({ error: "Etudiant introuvable!" });
    }
    if (!etudiant.taches) {
      return res.status(404).json({ error: "Aucune tâche trouvée!" });
    }
    const taches = await Task.find({ EtudiantID: etudiant.EtudiantID }).sort({ DateAjout: -1 });
    if (taches.length === 0) {
      return res.status(404).json({ error: "Aucune tâche trouvée!" });
    }
    const result = taches.map(({ Nom, Fichier }) => ({ Nom, Fichier }));
    res.status(200).json({ taches: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération des tâches!" });
  }
},
//get tasks by Id de tasks 
GetTaskByID: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    if (!etudiant) {
      return res.status(404).json({ error: "Etudiant introuvable!" });
    }

    const tache = await Task.findOne({ TaskID: req.params.TaskID, EtudiantID: etudiant.EtudiantID }, { _id: 0, Nom: 1, Fichier: 1 });
    if (!tache) {
      return res.status(404).json({ error: "Tâche introuvable!" });
    }

    res.status(200).json({ tache });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération de la tâche!" });
  }
},
//delete task by Id task et id etudiant
DeleteTask: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    if (!etudiant) {
      return res.status(404).json({ error: "Etudiant introuvable!" });
    }

    const tache = await Task.findOne({ TaskID: req.params.TaskID, EtudiantID: etudiant.EtudiantID });
    if (!tache) {
      return res.status(404).json({ error: "Tâche introuvable!" });
    }

    // Supprimer l'ObjectId de la tâche dans le tableau des tâches de l'étudiant
    await Etudiant.updateOne({ EtudiantID: req.body.EtudiantID }, { $pull: { taches: tache._id } });

    // Supprimer la tâche de la table des tâches
    await Task.deleteOne({ TaskID: req.body.TaskID, EtudiantID: etudiant.EtudiantID });

    res.status(200).json({ message: "Tâche supprimée avec succès!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la suppression de la tâche!" });
  }
},
// updateTask
ModifieTask: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    if (!etudiant) {
      return res.status(404).json({ error: "Etudiant introuvable!" });
    }

    const tache = await Task.findOne({ TaskID: req.body.TaskID, EtudiantID: etudiant.EtudiantID });
    if (!tache) {
      return res.status(404).json({ error: "Tâche introuvable!" });
    }

    tache.Nom = req.body.Nom;
    tache.Description = req.body.Description;
    tache.Fichier = req.body.Fichier;

    await tache.save();

    res.status(200).json({ message: "Tâche modifiée avec succès!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche!" });
  }
}
}
 module.exports = EtudiantContro;