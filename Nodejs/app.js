const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dbObject = require('./configuartion/connect.js');
const dbObjectU = require('./configuartion/connect.js');
const Etudiant= dbObject.Etudiant;
const Enseignant = dbObjectU.Enseignant;
const EtudiantContro = require('./controllers/EtudiantContro.js');
const EnseignantContro = require('./controllers/EnseignantContro');
const multer = require('multer');
const Upload = multer({
  limits: { fileSize: 1024 * 1024 * 50 },
}).any();

app.use(bodyParser.json());


//SET PORT
const portfinder = require('portfinder');
portfinder.getPort((err, port)=>{
  if(err) throw err;
  app.listen(port,()=>{
      console.log('le serveur est en écoute sur '+ port);
  });
});

app.use(cors({
  origin: `http://localhost:${portfinder}`,
  preflightContinue: true,
  optionsSuccessStatus: 200,
  credentials: true
}));

app.use(multer().single()); 
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Check if the request has a body
 // if (req.method !== 'GET' && req.method !== 'OPTIONS' && !req.headers['content-length']) {
   // const err = new Error('Content-Type header is missing');
    //err.status = 400;
    //return next(err);
  //}

  Upload(req, res, function (err) {
    if (err) {
      return next(err);
    }
    // Parse finished
    next();
  });
});


app.options(`http://localhost:${portfinder}`, cors());


const DemandeReinitialisationMotDePasse = require('./routes/mdpOublie');
app.use('/',DemandeReinitialisationMotDePasse);

//const resetPassword = require('./routes/mdpOublie');
//app.use('/',resetPassword);

const getProfile = require('./routes/ProfileEnseignant');
app.use('/Enseignant',getProfile);
const updateProfile = require('./routes/ProfileEnseignant');
app.use('/Enseignant',updateProfile);
const GetProfile =  require('./routes/ProfileChef.js');
app.use('/ChefDepart',GetProfile);
const UpdateProfile = require('./routes/ProfileChef.js');
app.use('/ChefDepart',UpdateProfile);

const deletProfil = require('./routes/ProfileEnseignant');
app.use('/Enseignant',deletProfil);
const getProfil = require('./routes/Profile.js');
app.use('/Etudiant',getProfil);
const updateProfil =require ('./routes/Profile.js');
app.use('/Etudiant',updateProfil)
const getEtudiantByDep = require('./routes/Admin.js');
app.use('/Admin',getEtudiantByDep);
const getEnseignantByDep = require('./routes/Admin.js');
app.use('/Admin',getEnseignantByDep);
const GetProfil = require('./routes/ProfileEncadrant');
app.use('/Encadrant',GetProfil);
const UpdateProfil = require('./routes/ProfileEncadrant');
app.use('/Encadrant',UpdateProfil);
const DeletProfil = require('./routes/ProfileEncadrant');
app.use('/Enacdrant',DeletProfil);
const demandeSujet = require('./routes/Etudiant.js');
app.use('/Etudiant',demandeSujet);
const gererDemandeSujet = require('./routes/Enseignant.js');
app.use('/Enseignant',gererDemandeSujet);
const AjouterStage = require('./routes/Etudiant.js');
app.use('/Etudiant',AjouterStage);
const GetEtudiantsAvecStatus = require('./routes/ChefDepart.js');
app.use('/ChefDepart',GetEtudiantsAvecStatus);
const UpdateEtudiantByID = require ('./routes/ChefDepart.js');
app.use('/ChefDepart',UpdateEtudiantByID);


const deleteProfil = require('./routes/Profile.js');
app.use('/Etudiant',deleteProfil);

const AjouteEtudiant = require('./routes/Etudiant');
app.use('/Etudiant',AjouteEtudiant);

const GetStagesbyEnseignantAbc = require ('./routes/Enseignant.js');
app.use('/Enseignant',GetStagesbyEnseignantAbc);
const Connexion = require('./routes/Connexion');
app.use('/',Connexion);
const verifierCodeValidation = require('./routes/mdpOublie.js');
app.use('/',verifierCodeValidation);
const ResetPassword = require('./routes/mdpOublie');
app.use('/ResetPassword/:codeValidation',ResetPassword);
//const connexion = require('./routes/Enseignant');
//app.use('/Enseignant',connexion);
const GetMyStages = require('./routes/Enseignant.js');
app.use('/Enseignant',GetMyStages);
//get stage
const getStage = require('./routes/Etudiant');
app.use('/Etudiant',getStage);
const DeposerStage = require('./routes/Etudiant');
app.use('/Etudiant',DeposerStage);

const validerDonneesStage = require('./routes/Etudiant');
app.use('/Etudiant',validerDonneesStage);

const updateStage = require('./routes/Etudiant');
app.use('/Etudiant',updateStage);
const deleteStage = require('./routes/Etudiant');
app.use('/Etudiant',deleteStage);
const router = require('./routes/Etudiant');
app.use('/Etudiant', router);
const DemanderEncadrement = require('./routes/Etudiant');
app.use('/Etudiant',DemanderEncadrement);

const gererDemande = require('./routes/Enseignant');
app.use('/Enseignant',gererDemande);

const gererStage = require('./routes/ChefDepart');
app.use('/ChefDepart',gererStage);

const AjouterEtudiant = require('./routes/ChefDepart');
app.use('/ChefDepart',AjouterEtudiant);
const AjouteEnseignant = require('./routes/ChefDepart');
app.use('/ChefDepart',AjouteEnseignant);

const  GetEtudiant = require('./routes/ChefDepart');
app.use('/ChefDepart',GetEtudiant);
const  GetEnseignant = require('./routes/ChefDepart');
app.use('/ChefDepart',GetEnseignant);
const  GetEnseignants = require('./routes/ChefDepart');
app.use('/ChefDepart',GetEnseignants);
const GetEtudiants = require('./routes/ChefDepart');
app.use('/ChefDepart',GetEtudiants);
const updateEtudiantById = require('./routes/ChefDepart');
app.use('/ChefDepart',updateEtudiantById);
const supprimerEtudiantById = require('./routes/ChefDepart.js');
app.use('/ChefDepart',supprimerEtudiantById);
const AffecterEtudiant = require('./routes/ChefDepart.js');
app.use('/ChefDepart',AffecterEtudiant);
const upload = require('./routes/UploadUser.js');
app.use('/User' , upload);
const AjouterSujet = require('./routes/Enseignant.js');
app.use('/Enseignant',AjouterSujet);
const ModifierSujet = require('./routes/Enseignant.js');
app.use('/Enseignant',ModifierSujet);
const SupprimerSujet = require('./routes/Enseignant.js');
app.use ('/Enseignant',SupprimerSujet);
const GetSujets = require('./routes/Enseignant.js');
app.use('/Enseignant',GetSujets);
const getSujetById = require('./routes/Enseignant.js');
app.use('/Enseignant',getSujetById);
const AjouteChefDepart = require('./routes/Admin.js');
app.use('/Admin',AjouteChefDepart);
const getEtudiants = require('./routes/Admin.js');
app.use('/Admin',getEtudiants);
const getEnseignants = require('./routes/Admin.js');
app.use('/Admin',getEnseignants);
const getChefDepart = require('./routes/Admin.js');
app.use('Admin',getChefDepart);
const SupprimerEtudiantById = require('./routes/Admin.js');
app.use('Admin',SupprimerEtudiantById);
const SupprimerEnseignantById = require('./routes/Admin.js');
app.use('Admin',SupprimerEnseignantById);
const getSujets = require ('./routes/Etudiant.js');
app.use('/Etudiant',getSujets);
const GetSujetById = require('./routes/Etudiant.js');
app.use('/Etudiant',GetSujetById);
const etudiants = require('./routes/UploadUser.js');
app.use('/ChefDepart',etudiants);
const GetEnseignantsD = require('./routes/Etudiant.js');
app.use('/Etudiant',GetEnseignantsD);
const getChefDepartByDep = require('./routes/Admin.js');
app.use('/Admin',getChefDepartByDep);
const GetEtudiantAffe = require('./routes/ChefDepart.js');
app.use('/ChefDepart',GetEtudiantAffe);
const CreateTask = require('./routes/Etudiant.js');
app.use('/Etudiant', CreateTask);
const GetTasks = require('./routes/Etudiant.js');
app.use('/Etudiant',GetTasks);
const GetTasksOA = require('./routes/Etudiant.js');
app.use('/Etudiant', GetTasksOA);
const GetTasksByDateA = require('./routes/Etudiant.js');
app.use('/Etudiant',GetTasksByDateA);
const GetTasksByDateD = require('./routes/Etudiant.js');
app.use('/Etudiant', GetTasksByDateD);
const GetTaskByID = require('./routes/Etudiant.js');
app.use('/Etudiant',GetTaskByID);
const DeleteTask = require('./routes/Etudiant.js');
app.use('/Etudiant',DeleteTask);
const ModifieTask = require('./routes/Etudiant.js');
app.use('/Etudiant', ModifieTask) 
const GetStudentTasks = require('./routes/Enseignant.js');
app.use('/Enseignant',GetStudentTasks);
const getTasksByDateA = require('./routes/Enseignant.js');
app.use('/Enseignant', getTasksByDateA);
const getTasksByDateD = require('./routes/Enseignant.js');
app.use('/Enseignant',getTasksByDateD);
const getTaskByID = require('./routes/Enseignant.js');
app.use('/Enseignant',getTaskByID);
const AddTask = require('./routes/Enseignant.js');
app.use('/Enseignant',AddTask);
const ValidateTask = require('./routes/Enseignant.js');
app.use('/Enseignant',ValidateTask);
const PrioriseTask = require('./routes/Enseignant.js');
app.use('/Enseignant',PrioriseTask);

const AjouterStages = require("./routes/Enseignant.js");
app.use('/Enseignant',AjouterStages);
const ModifieStages = require("./routes/Enseignant.js");
app.use('/Enseignant',ModifieStages);
const ModifieStage = require("./routes/Etudiant.js");
app.use('/Etudiant',ModifieStage);
const GetStagesByEnseignantID = require("./routes/Etudiant.js");
app.use('/Etudiant',GetStagesByEnseignantID);
const AjouterEncadrantPro = require("./routes/Etudiant.js");
app.use('/Etudiant',AjouterEncadrantPro);
const DemanderStage = require("./routes/Etudiant.js");
app.use('/Etudiant',DemanderStage);
const gererDemand =require("./routes/Enseignant.js");
app.use('/Enseignant',gererDemand);
const gererDemandeStage = require("./routes/Enseignant.js");
app.use('/Enseignant',gererDemandeStage);
const getEtudiantsEncadres = require("./routes/Enseignant.js");
app.use('/Enseignant',getEtudiantsEncadres);
const GetEtudiantAffectesEncadrant = require("./routes/ChefDepart.js");
app.use('/Enseignant',GetEtudiantAffe);
//const GetEnseignants = require("./routes/Etudiant.js");
//app.use('/Etudiant',GetEnseignants);
const getEtudiantNonAffecte = require ("./routes/ChefDepart.js");
app.use('/ChefDepart',getEtudiantNonAffecte);
const ModifierEtudiant = require ("./routes/ChefDepart.js");
app.use('/ChefDepart',ModifierEtudiant);
const AjouterEnseignant = require ("./routes/Enseignant.js");
app.use('/ChefDepartement',AjouterEnseignant);

//onst ajouterEtudiant = require ("./routes/Enseignant.js");
//app.use('/ChefDepartement',ajouterEtudiant);
//const getEtudiantAffe = require("./routes/Enseignant.js");
//app.use('/ChefDepartememnt',getEtudiantAffe);
const getEnseignant = require ("./routes/Enseignant.js");
app.use('/ChefDepartement',getEnseignant);
const GetStagesbyEnseignantID = require('./routes/Enseignant.js');
app.use('/Enseignant',GetStagesbyEnseignantID);
const SupprimeStages =require('./routes/Enseignant.js');
app.use('/Enseignant',SupprimeStages);
const UpdateEnseignantByID = require('./routes/ChefDepart.js');
app.use('/ChefDepart',UpdateEnseignantByID);
const UpdateChefDepartByID = require('./routes/Admin.js');
app.use('/Admin',UpdateChefDepartByID);
const AjouteAdmin = require('./routes/Admin.js');
app.use('/Admin',AjouteAdmin);
const GetEtudiantsAffectes = require('./routes/ChefDepart.js');
app.use('/ChefDepart',GetEtudiantsAffectes);
const GetEtudiantsNonAffectes = require('./routes/ChefDepart.js');
app.use('/ChefDepart',GetEtudiantsNonAffectes);
const GetEtudiantsAvecStatusStats = require('./routes/ChefDepart.js');
app.use ('/ChefDepart',GetEtudiantsAvecStatusStats);
const GetNombreEtudiantsEnseignantsParDepartement = require('./routes/ChefDepart.js');
app.use('/ChefDepart',GetNombreEtudiantsEnseignantsParDepartement);