const multer = require('multer');
const path = require('path');

// Configuration de Multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limite la taille à 5 Mo
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf|doc|odt|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Le fichier doit être au format PDF ou DOC/DOCX');
    }
  }
}).single('CahierCharge');

const saveFile = async (etudiant, file) => {
  etudiant.CahierChargePath = `uploads/${file.filename}`;
  await etudiant.save();
};

module.exports = { uploadFile, saveFile };
