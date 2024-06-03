const JWT_SECRET = "k1h8s270AR3B9h0"; 
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const router = express.Router();
const ERROR_INVALID_CREDENTIALS = "Email ou mot de passe invalide!";
const ERROR_INVALID_USER_TYPE = "Type d'utilisateur invalide!";
const ERROR_INVALID_LOGIN_PARAMS = "Vérifier vos paramètres de connexion!";

const CONNEXION_ROUTE = "/Connexion";

class User {
  constructor(model) {
    this.model = model;
  }

  async authenticate(email, password) {
    const user = await this.model.findOne({ Email: email });
    if (!user) {
      throw new Error(ERROR_INVALID_CREDENTIALS);
    }
    console.log("user:", user);

    const passwordMatch = await bcrypt.compare(password, user.MotDePasse);
    if (!passwordMatch) {
      throw new Error(ERROR_INVALID_CREDENTIALS);
    }
    console.log("passwordMatch:", passwordMatch);

    return user;
  }

  generateToken(user) {
    const token = jwt.sign({ Email: user.Email, userId: user.UserID }, JWT_SECRET, { expiresIn: "1h" });
    return token;
  }
}

class Etudiant extends User {
  constructor() {
    super(require('../models/Etudiant'));
  }

  async authenticate(email, password) {
    return await super.authenticate(email, password);
  }
}

class Enseignant extends User {
  constructor() {
    super(require('../models/Enseignant'));
  }

  async authenticate(email, password) {
    return await super.authenticate(email, password);
  }
}

class ChefDepart extends User {
  constructor() {
    super(require('../models/ChefDepart'));
  }

  async authenticate(email, password) {
    return await super.authenticate(email, password);
  }
}
class Admin extends User {
  constructor() {
    super(require('../models/Admin'));
  }

  async authenticate(email, password) {
    return await super.authenticate(email, password);
  }
}

router.post(CONNEXION_ROUTE, async (req, res) => {
  try {
    const { Email, MotDePasse } = req.body;

    // Vérifier les paramètres de connexion
    if (!Email || !MotDePasse) {
      return res.status(400).json({ error: ERROR_INVALID_LOGIN_PARAMS });
    }

    // Rechercher l'utilisateur dans les différents types d'utilisateurs
    const users = [new Etudiant(), new Enseignant(), new ChefDepart(),new Admin()];
    let authenticatedUser;
    let userType;

    for (const user of users) {
      try {
        authenticatedUser = await user.authenticate(Email, MotDePasse);
        userType = user.constructor.name;
        break;
      } catch (error) {
        console.error(error);
      }
    }

    // Si l'utilisateur n'a pas été trouvé, retourner une erreur
    if (!authenticatedUser) {
      throw new Error(ERROR_INVALID_CREDENTIALS);
    }

    // Générer un token pour l'utilisateur
    const userTypes = {
      Etudiant: Etudiant,
      Enseignant: Enseignant,
      ChefDepart: ChefDepart,
      Admin: Admin
    };
    const userInstance = new userTypes[userType]();
    const token = userInstance.generateToken(authenticatedUser);
    
let userID;

if (userType === "Etudiant") {
  userID = authenticatedUser.EtudiantID;
} else if (userType === "Enseignant") {
  userID = authenticatedUser.EnseignantID;
} else if (userType === "ChefDepart") {
  userID = authenticatedUser.ChefDepartID; 
} else if (userType === "Admin") {
  userID = authenticatedUser.AdminID;
} else {
  throw new Error(ERROR_INVALID_USER_TYPE);
}

  userInstance.UserID = userID;

  res.status(200).json({ status: `${userType} ${userID} ${authenticatedUser.Nom} Votre connexion a été effectuée avec succès!`, token: token, expiresIn: 3600 });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

  module.exports=router;