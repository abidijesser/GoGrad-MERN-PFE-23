const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Enseignant = require('../models/Enseignant');
const Etudiant = require('../models/Etudiant');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const JWT_SECRET = "k1h8s270AR3B9h0"; 
const AppPass="zpzjmvdyannqxrsl";
const EmailAPP="gogradpfe@gmail.com";
const Task = require('../models/Task');
const Stage = require('../models/Stage');
const StatusEnum = require('../models/Etudiant');
async function generateRandomPassword(length) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
}
async function generateID(length){
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let ID = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      ID += chars[randomIndex];
    }
    return ID.toString();
    
}  
const EnseignantContro={
AjouteEnseignant: async (req, res) => {
        const saltRounds=10;
        const salt = await bcrypt.genSalt(saltRounds);
        const password= await generateRandomPassword(12);
        const MDP=password.toString();
        const hashedpassword =  await bcrypt.hash(MDP, salt);
        const hashedPassword = hashedpassword.toString();
        const Today = new Date();
        const InfoEnseignant = {
          ID:id,
          Nom: req.body.Nom,
          Prenom: req.body.Prenom,
          Email: req.body.Email,
          Téléphone: req.body.Téléphone,
          Departement: req.body.Departement,
          MotDePasse: hashedPassword,
          verif: Today,
          active:false,
        };
        try {
          const enseignant = await Enseignant.findOne({ Email: req.body.Email });
          JSON.parse(JSON.stringify(enseignant));
          if (enseignant) {
            return res.status(409).json({ error: "L'utilisateur existe déjà!" });
          }
          const newEnseignant = new Enseignant(InfoEnseignant);
          const savedEnseignant = await newEnseignant.save();
          const payload = {Email: req.body.Email};
          const token = jwt.sign(payload, "k1h8s270AR3B9h0", {expiresIn:"360000"});
          const transporter = nodemailer.createTransport({
            service:"Gmail",
            auth:{
              user:"gogradpfe@gmail.com",
              pass:"zpzjmvdyannqxrsl",
            },
          });
          const mailOptions={
            from : "gogradpfe@gmail.com",
            to :savedEnseignant.Email,
            subject:"Vérification de votre compte",
            text:"Bonjour M./Mme. ${InfoEnseignant.Nom},\n\n" +
            "Votre mot de passe temporaire est : " + MDP + ".\n\n" +
            "Nous vous recommandons de changer votre mot de passe dès votre première connexion.\n\n" +
            "Cliquez sur le lien suivant pour activer votre compte : http://localhost:8000/activer-compte/" + token + "\n\n" +
            "Cordialement,\n"
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
//gestion demande Encadrement
gererDemande: async function(req, res) {
  try {
    const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });

    if (!etudiant || !enseignant) {
      return res.status(404).json({ error: "L'étudiant ou l'enseignant est introuvable!" });
    }

    const stage = await Stage.findOne({ EtudiantID: etudiant.EtudiantID });

    if (!stage) {
      return res.status(404).json({ error: "Le stage de l'étudiant est introuvable!" });
    }

    if (req.query.action === 'accepter') {
      stage.EnseignantID = enseignant.EnseignantID;
      

      etudiant.EnseignantID = enseignant.EnseignantID;
      stage.AccepterBtnClicked = true;
      stage.RefuserBtnClicked = false;
    } else if (req.query.action === 'refuser') {
      stage.AccepterBtnClicked = false;
      stage.RefuserBtnClicked = true;
    }
  console.log(stage);
    try {
      await etudiant.save();
      console.log("Etudiant enregistré avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'étudiant :", error);
    }
    try {
      await stage.save();
      console.log("Stage enregistré avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du stage :", error);
    }
    
    // Envoi email aux étudiants concernés
    
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EmailAPP,
        pass: AppPass,
      }
    });

    const mailOptions = {
      from: enseignant.Email,
      to: etudiant.Email,
      subject: "Réponse à votre demande d'encadrement",
      html: `
        Bonjour ${etudiant.Nom} ${etudiant.Prenom},<br><br>
        Votre demande d'encadrement pour le stage "${stage.Titre}" a été traitée par l'enseignant ${enseignant.Nom}.<br><br>
        ${req.query.action === 'accepter' ? 'L\'enseignant a accepté votre demande. Vous pouvez maintenant commencer votre collaboration.' : 'L\'enseignant a refusé votre demande. Nous vous encourageons à chercher un autre encadrant pour votre stage.'}<br><br>
        Cordialement,<br>
        L'équipe d'encadrement
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi de la réponse!" });
      } else {
        console.log('Email envoyé: ' + info.response);
        return res.status(200).json({ message: "La réponse a été envoyée avec succès!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Une erreur s'est produite lors de la gestion de la demande!" });
  }
},
gererDemandeStage: async function (req, res) {
  try {
    const etudiantID = req.params.EtudiantID;
    const enseignantID = req.params.EnseignantID;
    const action = req.query.action;

    const etudiant = await Etudiant.findOne({ EtudiantID: etudiantID });
    const enseignant = await Enseignant.findOne({ EnseignantID: enseignantID });

    if (!etudiant || !enseignant) {
      return res.status(404).json({ error: "L'étudiant ou l'enseignant est introuvable!" });
    }

    const stage = await Stage.findOne({ EnseignantID: enseignant.EnseignantID });

    if (!stage) {
      return res.status(404).json({ error: "Le stage proposé par l'enseignant est introuvable!" });
    }

    if (action === 'accepter') {
      etudiant.EncadrementStatus = StatusEnum.Accepte; // Mettre à jour le champ EncadrementStatus à 'Accepte'
  
      stage.EtudiantID = etudiantID;  // Ajouter l'ID de l'étudiant au tableau EtudiantID de la table "stage"

      await stage.save();

      

    } else if (action === 'refuser') {
      etudiant.EncadrementStatus = StatusEnum.Refuse; // Mettre à jour le champ EncadrementStatus à 'Refuse'
      stage.EtudiantID = null; // Supprimer l'ID de l'étudiant du stage refusé
    } else {
      return res.status(400).json({ error: "Action invalide!" });
    }
    await stage.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EmailAPP,
        pass: AppPass,
      }
    });
    const mailOptions = {
      from: enseignant.Email,
      to: etudiant.Email,
      subject: "Réponse à votre demande de stage",
      html: `
        <div style="background-color: #f2f2f2; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 5px;">
            <h2 style="color: #333333;">Cher(e) ${etudiant.Prenom} ${etudiant.Nom},</h2>
            ${
              action === 'accepter'
                ? `
                  <p style="color: #008000; font-weight: bold;">
                    Félicitations ! Votre demande de stage pour le stage "${stage.Titre}" a été acceptée.
                  </p>
                  <p style="color: #333333;">
                  Votre talent et votre enthousiasme seront un excellent ajout à mon projet.
                  </p>
                `
                : `
                  <p style="color: #ff0000; font-weight: bold;">
                    Je regrette de vous informer que votre demande de stage pour le stage "${stage.Titre}" a été refusée.
                  </p>
                  <p style="color: #333333;">
                    Nous vous remercions pour l'intérêt que vous avez porté à notre programme de stage. Bien que votre demande n'ait pas été retenue cette fois-ci, nous encourageons vivement à continuer à poursuivre vos objectifs et à explorer d'autres opportunités.
                  </p>
                `
            }
            <p style="color: #333333;">N'hésitez pas à me contacter si vous avez des questions supplémentaires ou si vous souhaitez des conseils pour vos futurs projets.</p>
            <br>
            <p style="color: #333333;">Cordialement,</p>
            <p style="color: #333333;">${enseignant.Nom}</p>
            <p style="color: #333333;">Enseignant</p>
          </div>
        </div>
      `
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi de la réponse!" });
      } else {
        console.log('Email envoyé: ' + info.response);
        return res.status(200).json({ message: "La réponse a été envoyée avec succès!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Une erreur s'est produite lors de la gestion de la demande!" });
  }
},

// Définir la méthode GET pour récupérer les étudiants encadrés par un enseignant
getEtudiantsEncadres: async function(req, res) {
  try {
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }
    const etudiants = await Etudiant.find({});
    const etudiantsProfiles = await Promise.all(etudiants.map(async (etudiant) => {
      const { Nom, Prenom, Email } = etudiant;
      const stage = await Stage.findOne({
        EtudiantID: etudiant.EtudiantID,
        EnseignantID: req.params.EnseignantID
      });
     
      const encadreParEnseignant = stage ? true : false;
      const { Titre, Description, Technologie } = stage || {}; // Récupération des données de stage
      
      return { Nom, Prenom, Email, encadreParEnseignant, Titre, Description, Technologie };
    }));

    const supervisedEtudiants = etudiantsProfiles.filter(etudiant => etudiant.encadreParEnseignant);
    if (supervisedEtudiants.length === 0) {
      return res.status(200).json({ message: "Aucun étudiant n'est encadré par cet enseignant." });
    }
    res.status(200).json(supervisedEtudiants);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération des étudiants" });
  }
},


GetEtudiant: async function(req, res) {
    try {
      const etudiants = await Etudiant.find({EtudiantID:req.params.EtudiantID});
      if (!etudiants) {
        return res.status(404).json({ message: "L'étudiant n'existe pas" });
      }
      for (let i = 0; i < etudiants.length; i++) {
        const { Nom, Prenom, Email, Departement, Filiere } = etudiants[i];
        res.status(200).json({ Nom, Prenom, Email, Departement, Filiere });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erreur lors de la récupération de l'étudiant" });
    }
},
// a modifier get uniquement les étudiants encadrés  
GetEtudiants: async function(req, res) {
    try {
            const etudiants = await Etudiant.find({});
            const etudiantsProfiles = etudiants.map(etudiant => {
                const { Nom, Prenom, Email, Departement, Filiere } = etudiant;
                return { Nom, Prenom, Email, Departement, Filiere };
            });
            res.status(200).json(etudiantsProfiles);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Erreur lors de la récupération des étudiants" });
        }
},    
// get stages 
getStages: async function(req, res) {
  try{
    const enseignant = await Enseignant.findOne({EnseignantID:req.params.EnseignantID});
    if(!enseignant){
      return res.status(404).json({message:"Chef departement  n'existe pas"});
    }
    if (!enseignant.ChefDepartement) {
      return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
    }

  }catch(error){
    console.error(error);
    res.status(500).json({message:"Une erreur s'est produite"});
  }
},
//Ajouter stage
AjouterStages: async function (req, res) {
  try {
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });

    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }

    const nouveauStage = req.body;

    const stageID = await generateID(6); // Appeler la méthode generateID pour générer le stageID

    const nouveauStageObj = {
      StageID: stageID,
      EnseignantID: req.params.EnseignantID,
      SujetID: stageID, // Utiliser la même valeur que stageID pour SujetID
      Titre: nouveauStage.Titre,
      Technologie:nouveauStage.Technologie,
      Description  : nouveauStage.Description,
      DateAjout: Date.now(),
      EncadrementStatus: "En attente",
      Demande: false,
      ProposePar: "",
    };

    const stage = new Stage(nouveauStageObj);
    await stage.save();

    if (!enseignant.sujetsProposes) {
      enseignant.sujetsProposes = []; // Initialiser sujetsProposes comme un tableau vide
    }
    
    enseignant.sujetsProposes.push(stageID);
    await enseignant.save();

    return res.status(200).json({ message: "Le stage a été ajouté avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de l'ajout du stage" });
  }
},
//Modifie stage
ModifieStages: async function(req, res) {
  try {
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
    const stageID = req.params.StageID;
    const updateData = req.body;

    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }

    const stage = await Stage.findOne({ StageID: stageID });

    if (!stage || stage.ProposePar !== "Encadrant Universitaire") {
      return res.status(404).json({ message: "Stage non trouvé ou n'a pas été ajouté par l'enseignant" });
    }

    if (stage.EnseignantID !== enseignant.EnseignantID) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce stage" });
    }

    stage.Titre = updateData.Titre || stage.Titre;
    stage.Description = updateData.Description || stage.Description;
    stage.Technologie = updateData.Technologie || stage.Technologie;

    await stage.save();

    return res.status(200).json({ message: "Le stage a été modifié avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de la modification du stage" });
  }
},
//supprimeStage
SupprimeStages :async function(req,res){
  try {
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }
    const stage = await Stage.findOne({ StageID: req.params.StageID, EnseignantID: req.params.EnseignantID });
    if (!stage || stage.ProposePar !== "Encadrant Universitaire") {
      return res.status(404).json({ message: "Stage non trouvé ou n'a pas été ajouté par l'enseignant" });
    }

    // Check if the stage is associated with the current enseignant
    if (stage.EnseignantID !== req.params.EnseignantID) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer ce stage" });
    }
    // Check if the stage is assigned to an etudiant
if (stage.EtudiantID) {
  return res.status(403).json({ message: "Impossible de supprimer un stage affecté à un étudiant" });
}

    await Stage.deleteOne({ StageID: req.params.StageID });

    return res.status(200).json({ message: "Stage supprimé avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite lors de la suppression" });
  }

},
//partie gestion de tache
GetStudentTasks: async function(req, res) {
      try {
        const enseignant = await Enseignant.findOne({EnseignantID: req.params.EnseignantID});
        if(!enseignant) {
          return res.status(404).json({error:"Enseignant introuvable"});
        }
        const etudiant = await Etudiant.findOne({EtudiantID: req.params.EtudiantID});
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
// get tasks par ordre chronologique
getTasksByDateA: async function(req, res) {
        try {
          const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
          
          if (!enseignant) {
            return res.status(404).json({ message: "Enseignant non trouvé" });
          }
          
          const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
          
          if (!etudiant) {
            return res.status(404).json({ message: "Etudiant non trouvé" });
          }
          
          
          
          const tasks = await Task.find({ EtudiantID: etudiant.EtudiantID }).sort({ DateAjout: 1 });
          
          if (tasks.length === 0) {
            return res.status(404).json({ message: "Aucune tâche trouvée pour cette date!" });
          }
          
          const tasksSimplifiees = tasks.map(task => ({ Nom: task.Nom, Fichier: task.Fichier }));
          
          res.status(200).json({ taches: tasksSimplifiees });
        } catch (err) {
          res.status(500).json({ message: "Erreur lors de la récupération des tâches!" });
        }
},
//get tasks by date asc
getTasksByDateD: async function(req, res) {
      try {
        const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
        if (!enseignant) {
          return res.status(404).json({ error: "enseignant introuvable!" });
        
        }

        const etudiant = await Etudiant.findOne({ EtudiantID: req.params.EtudiantID });
          
        if (!etudiant) {
          return res.status(404).json({ message: "Etudiant non trouvé" });
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
getTaskByID: async function(req, res) {
      try {
        const enseignant = await Enseignant.findOne({Enseignant : req.params.Enseignant});
        if(!enseignant) {
          return res.status(404).json({error:"Enseignant introuvable"});
        }
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
//Add task 
AddTask: async function(req, res) {
  try {
    const {EtudiantID,EnseignantID}=req.params
    const { Nom, Fichier, DateAjout, DateÉcheance } = req.body;

    // Vérifier si l'enseignant existe dans la base de données
    const enseignant = await Enseignant.findOne({ EnseignantID });
    if (!enseignant) {
      return res.status(404).json({ error: "Enseignant introuvable!" });
    }

    const etudiant = await Etudiant.findOne({ EtudiantID });
    if (!etudiant) {
      return res.status(404).json({ error: "Etudiant introuvable!" });
    }
    //if (!enseignant.enseignements.includes(etudiant.EnseignementID)) {
      //return res.status(403).json({ error: "L'enseignant n'est pas autorisé à ajouter des tâches pour cet étudiant!" });
    //}
    // Générer l'identifiant de la tâche
    const TaskID = await generateID(8);

    // Créer la tâche dans la base de données
    const task = new Task({ TaskID, Nom, Fichier, DateAjout, DateÉcheance, EtudiantID });
    await task.save();
    // informer l'etudiant qu'il a une tache a fichier 
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EmailAPP,
        pass: AppPass, 
      },
    });
    const emailOptions = {
      to: etudiant.Email,
      subject: "Nouvelle tache ajoutée",
      text: `Bonjour ${etudiant.Nom}, une nouvelle tâche a été ajoutée à votre liste de tâches par votre encadrant.`,
    };
    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi du mail!" });
      } else {
        console.log("Email envoyé :" + info.response);
        return res.status(200).json({ status: "Email envoyé!" });
      }
    });
    

    // Ajouter l'ID de la tâche à la liste des tâches de l'étudiant
    etudiant.taches.push(task._id);

    // Sauvegarder les modifications dans la base de données
    await etudiant.save();

    // Renvoyer une réponse avec la tâche ajoutée
    res.status(201).json({ message: "Tâche ajoutée avec succès!", task });
    // Envoi de l'email contenant les informations de connexion
   
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de l'ajout de la tâche!" });
  }
},
//validate task
ValidateTask : async function(req,res){
try{
  const{EnseignantID , EtudiantID , TaskID} = req.params;
  const enseignant = await Enseignant.findOne({ EnseignantID });
    if (!enseignant) {
      return res.status(404).json({ error: "Enseignant introuvable!" });
    }

    const etudiant = await Etudiant.findOne({ EtudiantID });
    if (!etudiant) {
      return res.status(404).json({ error: "Etudiant introuvable!" });
    }
    const task = await Task.findOne({ TaskID });
    if (!task) {
      return res.status(404).json({ error: "tache introuvable!" });
    }
    if(action === "valider"){
      Task.Validate = true;
    }
    await task.save();
    
    res.status(200).json({ message: "Tâche validée avec succès!", task });

}catch(error){
  console.log(error);
  res.status(500).json({message : "Une erreur s'est produite !"})
}

},
// proriser tache
PrioriseTask : async function(req,res){
  try{
    const{EnseignantID , EtudiantID , TaskID} = req.params;
    const enseignant = await Enseignant.findOne({ EnseignantID });
      if (!enseignant) {
        return res.status(404).json({ error: "Enseignant introuvable!" });
      }
  
      const etudiant = await Etudiant.findOne({ EtudiantID });
      if (!etudiant) {
        return res.status(404).json({ error: "Etudiant introuvable!" });
      }
      const task = await Task.findOne({ TaskID });
      if (!task) {
        return res.status(404).json({ error: "Tâche introuvable!" });
      }
      if(action === "Priorisée"){
        Task.Priorise = true;
      }
      await task.save();
      
      res.status(200).json({ message: "Tâche priorisée avec succès!", task });
  
  }catch(error){
    console.log(error);
    res.status(500).json({message : "Une erreur s'est produite !"})
  }
  
},
//chefDepartement==true
AjouterEnseignant: async (req, res) => {
const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
if (!enseignant) {
  return res.status(404).json({ error: "chefDepart introuvable!" });
}
// Récupérer automatiquement le département de l'enseignant en question
const departement = enseignant.Departement;
if (!enseignant.ChefDepartement) {
  return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
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
       // Téléphone: req.body.Téléphone ,
        Departement: departement,
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
        //<p>Bonjour Mr/Mme ${savedEnseignant.Nom} ${savedEnseignant.Prenom},</p>
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
ajouterEtudiant: async (req, res) => {
const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
if (!enseignant) {
  return res.status(404).json({ error: "chefDepart introuvable!" });
}
if (!enseignant.ChefDepartement) {
  return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
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
const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
if (!enseignant) {
  return res.status(404).json({ error: "chefDepart introuvable!" });
}
if (!enseignant.ChefDepartement) {
  return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
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
getEnseignant: async function(req, res) {
  try {
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID1});
    if (!enseignant) {
      return res.status(404).json({ error: "Enseignant introuvable!" });
    }
    if (!enseignant.ChefDepartement) {
      return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
    }
    const enseignantRecherche = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID2 });
    if (!enseignantRecherche) {
      return res.status(404).json({ message: "L'enseignant recherché n'existe pas" });
    }

    const { Nom, Prenom, Email, Téléphone, Departement, Spécialité } = enseignantRecherche;
    res.status(200).json({ Nom, Prenom, Email, Téléphone, Departement, Spécialité });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'enseignant" });
  }
},

//get all student  
GetEtudiants: async function(req, res) {
      try {
        const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
        if (!enseignant) {
          return res.status(404).json({ error: "chefDepart introuvable!" });
        }
        if (!enseignant.ChefDepartement) {
          return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
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
try { 
  const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
if (!enseignant) {
  return res.status(404).json({ error: "chefDepart introuvable!" });
}
if (!enseignant.ChefDepartement) {
  return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
}
        const enseignants = await Enseignant.find({ Departement: chefDepart.Departement });
        const enseignantsProfiles = enseignants.map(enseignant => {
            const { Nom, Prenom, Email,Téléphone ,Departement, Spécialité } = enseignant;
            return { Nom, Prenom, Email, Téléphone,Departement, Spécialité };
        });
        res.status(200).json(enseignantsProfiles);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erreur lors de la récupération des enseignants" });
    }
},        
// Modifier etudiant 
ModifierEtudiant: async function(req, res) {
const { EtudiantID } = req.params;
const newData = req.body; // Nouvelles données à mettre à jour pour l'étudiant
try {
  const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });

  if (!enseignant) {
    return res.status(404).json({ error: "Chef de départ introuvable!" });
  }
  if (!enseignant.ChefDepartement) {
    return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
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
// supprimer etudiant    
supprimerEtudiantById: async function(req, res) {
try {
  const enseignant = await Enseignant.findOne( {EnseignantID:req.params.EnseignantID});
  if(!enseignant){
    return res.status(404).json({message:"chef departement n'existe pas "});
  }
  if (!enseignant.ChefDepartement) {
    return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
  }
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
  const enseignante = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
  if (!enseignante) {
      return res.status(404).json({ message: "chef departement    n'existe pas" });
  }
  if (!enseignante.ChefDepartement) {
    return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
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
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
    if (!enseignant) {
        return res.status(404).json({ message: "Chef departement n'existe pas n'existe pas" });
    }
    if (!enseignant.ChefDepartement) {
      return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
    }
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

getEtudiantAffe: async function (req, res) {
try {
  const enseignante = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
  if (!enseignante) {
    return res.status(404).json({ error: "Chef de départ introuvable!" });
  }
  if (!enseignante.ChefDepartement) {
    return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
  }
  // Récupérer tous les enseignants liés au chef de départ
  const enseignants = await Enseignant.find({ Departement: enseignante.Departement });

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
            NomEtudiant: etudiant.Nom,
            PrenomEtudiant: etudiant.Prenom,
            
            TitreStage: stage.Titre,
              DateFinStage: stage.DateFin,
          
            Enseignant: {
              NomEnseignant: enseignant.Nom,
              PrenomEnseignant: enseignant.Prenom
            }
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
  const enseignante = await Enseignant.findOne({ EnseignanteID: req.params.EnseignantID });
  if (!enseignante) {
    return res.status(404).json({ error: "Chef de départ introuvable!" });
  }
  if (!enseignante.ChefDepartement) {
    return res.status(403).json({ error: "Accès non autorisé. Seul le chef de département peut accéder à cette fonctionnalité." });
  }

  // Récupérer tous les étudiants
  const etudiants = await Etudiant.find();

  const etudiantsNonAffectés = [];

  for (const etudiant of etudiants) {
    // Vérifier si l'étudiant est affecté à un enseignant
    const stage = await Stage.findOne({ EtudiantID: etudiant.EtudiantID });

    if (!stage || !stage.EnseignantID) {
      const etudiantData = {
        Nom: etudiant.Nom,
        Prenom: etudiant.Prenom,
        Stage: {
          Titre: stage ? stage.Titre : "",
          DateFin: stage ? stage.DateFin : ""
        }
      };

      etudiantsNonAffectés.push(etudiantData);
    }
  }

  // Retourner la liste des étudiants non affectés
  return res.status(200).json(etudiantsNonAffectés);
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des étudiants non affectés!" });
}
},
GetStagesbyEnseignantID: async function(req, res) {
  try {
    const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });

    if (!enseignant) {
      return res.status(404).json({ message: "Enseignant non trouvé" });
    }

    const stages = await Stage.find({ EnseignantID: req.params.EnseignantID }, { _id: 0, StageID: 1, Titre: 1, Description: 1, Technologie: 1 });

    if (stages.length === 0) {
      return res.status(200).json({ message: "L'enseignant n'a pas de stages proposés" });
    }

    return res.status(200).json(stages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Une erreur s'est produite" });
  }
},
//get stages by ordre alphabétique

//get mes liste de stages 
GetMyStages: async function(req, res) {
    try {
      const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
      if (!enseignant) {
        return res.status(404).json({ message: "Enseignant non trouvé" });
      }
  
      const stages = await Stage.find({ EnseignantID: req.params.EnseignantID });
      if (!stages || stages.ProposePar==="Encadrant Universitaire") {
        return res.status(404).json({ message: "Pas de stage trouvé pour cet enseignant" });
      }
  
      const stagesAffectes = stages.filter(stage => stage.EtudiantID && stage.ProposePar === "Encadrant Universitaire");
      const stagesNonAffectes = stages.filter(stage => !stage.EtudiantID && stage.ProposePar === "Encadrant Universitaire");
  
      return res.status(200).json({ stagesAffectes, stagesNonAffectes });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur s'est produite" });
    }
  },
//trier par date d'ajout du plus recent vers le plus ancien 
  //trier par ordre aplhabetique desc
GetStagesbyEnseignantAbc: async function(req, res) {
    try {
      const enseignant = await Enseignant.findOne({ EnseignantID: req.params.EnseignantID });
  
      if (!enseignant) {
        return res.status(404).json({ message: "Enseignant non trouvé" });
      }
  
      const stages = await Stage.find({ EnseignantID: req.params.EnseignantID }, { _id: 0, StageID: 1, Titre: 1, Description: 1, Technologie: 1 }).sort({ Titre: 1 });
  
      if (stages.length === 0) {
        return res.status(200).json({ message: "L'enseignant n'a pas de stages proposés" });
      }
  
      return res.status(200).json(stages);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Une erreur s'est produite" });
    }
  },
//trier par ordre aplhabetique asc


} 

module.exports= EnseignantContro;