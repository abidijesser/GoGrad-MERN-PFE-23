const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const router = express.Router();
const AppPass="zpzjmvdyannqxrsl";
const EmailAPP="gogradpfe@gmail.com";
class User {
  constructor(model) {
    this.model = model;
  }

  async Demande(Email) {
    let user = await this.model.findOne({ Email: Email });
    if (!user) {
      throw new Error("Email invalide!");
    }

    // Determine the user's specific class based on the model used to fetch the user
    let UserClass;
    if (this.model.modelName === "Etudiant") {
      UserClass = Etudiant;
    } else if (this.model.modelName === "Enseignant") {
      UserClass = Enseignant;
    } else if (this.model.modelName === "ChefDepart") {
      UserClass = ChefDepart;
    } else if (this.model.modelName === "Encadrant") {
      UserClass = Encadrant;  
    } else if (this.model.modelName === "Responsable") {
      UserClass = Responsable;  
    } else if (this.model.modelName === "Admin") {
      UserClass = Admin;  
    } else {
      throw new Error("Modèle de l'utilisateur inconnu!");
    }

    // Create an instance of the user's specific class and return it
    const userInstance = new UserClass();
    Object.assign(userInstance, user.toObject());
    return userInstance;
  }

  generateToken(user) {
    const token = jwt.sign({ Email: user.Email, userId: user.UserID }, JWT_SECRET, { expiresIn: "1h" });
    return token;
  }

  async VerifierValidationCode(codeValidation) {
    const user = await this.model.findOne({ codeValidation: codeValidation });
  
    if (!user) {
      throw new Error("Le code de validation est invalide");
    }

    if (user.validationCodeExpiration < Date.now()) {
      throw new Error("Le code de validation a expiré!");
    }

    return user;
  }
  async  resetPassword(codeValidation, MotDePasse) {
    const user = await this.model.findOne({ codeValidation: codeValidation });
    console.log(user);
    if (!user) {
      throw new Error("Utilisateur introuvable!");
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(MotDePasse, salt);
    user.MotDePasse = hashedPassword;
    await user.save();
    return true;
  }
}

class Etudiant extends User {
  constructor() {
    super(require("../models/Etudiant"));
  }

  async save() {
    const etudiantModel = this.model;
    await etudiantModel.updateOne({ EtudiantID: this.EtudiantID }, this);
  }

  generateToken(user) {
    return super.generateToken(user);
  }
  VerifierValidationCode(codeValidation){
    return super.VerifierValidationCode(codeValidation);
  }
  resetPassword(codeValidation, password){
    return super.resetPassword(codeValidation, password);
  }


}

class Enseignant extends User {
  constructor() {
    super(require("../models/Enseignant"));
  }

  async save() {
    const EnseignantModel = this.model;
    await EnseignantModel.updateOne({ EnseignantID: this.EnseignantID }, this);
  }

  generateToken(user) {
    return super.generateToken(user);
  }
  VerifierValidationCode(codeValidation){
    return super.VerifierValidationCode(codeValidation);
  }
  resetPassword(codeValidation, password){
    return super.resetPassword(codeValidation, password);
  }
}


class ChefDepart extends User {
  constructor() {
    super(require('../models/ChefDepart'));
  }
  
  async save() {
    const ChefDepartModel = this.model;
    await ChefDepartModel.updateOne({ ChefDepartID: this.ChefDepartID }, this);
  }

  generateToken(user) {
    return super.generateToken(user);
  }
  VerifierValidationCode(codeValidation){
    return super.VerifierValidationCode(codeValidation);
  }
  resetPassword(codeValidation, password){
    return super.resetPassword(codeValidation, password);
  }
}
class Encadrant extends User {
  constructor() {
    super(require('../models/Encadrant'));
  }
  
  async save() {
    const EncadrantModel = this.model;
    await EncadrantModel.updateOne({ EncadrantID: this.EncadrantID }, this);
  }

  generateToken(user) {
    return super.generateToken(user);
  }
  VerifierValidationCode(codeValidation){
    return super.VerifierValidationCode(codeValidation);
  }
  resetPassword(codeValidation, password){
    return super.resetPassword(codeValidation, password);
  }
}
class Responsable extends User {
  constructor() {
    super(require('../models/Responsable'));
  }
  
  async save() {
    const ResponsableModel = this.model;
    await ResponsableModel.updateOne({ ResponsableID: this.ResponsableID }, this);
  }

  generateToken(user) {
    return super.generateToken(user);
  }
  VerifierValidationCode(codeValidation){
    return super.VerifierValidationCode(codeValidation);
  }
  resetPassword(codeValidation, password){
    return super.resetPassword(codeValidation, password);
  }
}
class Admin extends User {
  constructor() {
    super(require('../models/Admin'));
  }
  
  async save() {
    const AdminModel = this.model;
    await AdminModel.updateOne({ AdminID: this.AdminID }, this);
  }

  generateToken(user) {
    return super.generateToken(user);
  }
  VerifierValidationCode(codeValidation){
    return super.VerifierValidationCode(codeValidation);
  }
  resetPassword(codeValidation, password){
    return super.resetPassword(codeValidation, password);
  }
}



router.post("/demandeReinitialisationMotDePasse", async function (req, res) {
  const { Email } = req.body;
  if (!Email) {
    return res.status(400).json({ error: "L'adresse email est manquante!" });
  }

  try {
    let user;

    const models = [Etudiant, Enseignant, ChefDepart , Encadrant, Responsable, Admin ];
    for (const Model of models) {
      const instance = new Model();
      try {
        user = await instance.Demande(Email);
        break;
      } catch (err) {
        console.log(err);
      }
    }

    if (!user) {
      return res.status(404).json({ error: "L'utilisateur n'existe pas!" });
    }

    const validationCode = Math.floor(1000 + Math.random() * 9000); // Génère un code aléatoire de 4 chiffres
    user.codeValidation = validationCode;
    user.validationCodeExpiration = Date.now() + 120000; // Le code est valide pendant 2minutes à partir de maintenant
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: EmailAPP,
        pass: AppPass, 
      },
    });

    const mailOptions = {
      from: EmailAPP,
      to: Email,
      subject: "Code de validation pour la réinitialisation de votre mot de passe",
      html: `<p>Bonjour ${user.Nom},</p>
             <p>Voici votre code de validation:</p>
             <h1>${validationCode}</h1>
             <p>Ce code est valide pendant 2 minutes.</p>
             <p>Si vous n'avez pas fait cette demande, ignorez ce message.</p>
             <p>Cordialement,</p>
             <p>L'équipe de GradGO</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Une erreur s'est produite lors de l'envoi du mail!" });
      } else {
        console.log("Email envoyé :" + info.response);
        return res.status(200).json({ status: "Email de réinitialisation de mot de passe envoyé!" });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});
router.post("/verifierCodeValidation", async function (req, res) {
  const { codeValidation } = req.body;
  if (!codeValidation) {
    return res.status(400).json({ error: "Le code de validation est manquant!" });
  }

  try {
    let user;

    const models = [ Enseignant, ChefDepart , Encadrant, Responsable, Admin,Etudiant ];
    for (const Model of models) {
      const instance = new Model();
      try {
        user = await instance.VerifierValidationCode(codeValidation);
        
        break;
      } catch (err) {
        console.log(err);
      }
    }

    if (!user) {
      return res.status(404).json({ error: "Le code de validation est invalide " });
    }

    return res.status(200).json({ status: "Le code de validation est valide!" });
    
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});
router.post("/ResetPassword/:codeValidation", async function (req, res) {
  const { nouveauMotDePasse, confirmMotDePasse } = req.body;

  if (!nouveauMotDePasse || !confirmMotDePasse) {
    return res.status(400).json({ error: "Le nouveau mot de passe et la confirmation du mot de passe sont manquants!" });
  }

  if (nouveauMotDePasse !== confirmMotDePasse) {
    return res.status(400).json({ error: "La confirmation du mot de passe ne correspond pas au nouveau mot de passe!" });
  }

  try {
    let user;

    const models = [Etudiant, Enseignant, ChefDepart, Encadrant, Responsable, Admin];
    for (const Model of models) {
      const instance = new Model();
      try {
        user = await instance.resetPassword(req.params.codeValidation, nouveauMotDePasse);
        console.log(user);
        break;
      } catch (err) {
        console.log(err);
      }
    }

    if (!user) {
      return res.status(404).json({ error: "L'utilisateur n'existe pas!" });
    }

    return res.status(200).json({ status: "Le mot de passe a été réinitialisé avec succès!" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
});





module.exports = router;