const bcrypt = require("bcrypt");
const Encadrant = require('../models/Encadrant');
const Etudiant = require('../models/Etudiant');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
 //token: k1h8s270AR3B9h0
async function generateRandomPassword(length) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }
const ResponsableContro={


}




module.exports= ResponsableContro;