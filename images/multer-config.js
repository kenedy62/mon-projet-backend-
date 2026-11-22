const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');


// Configuration avec vos clés Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_Root,
  api_key: process.env.CLOUDINARY_API_855362635721481,
  api_secret: process.env.CLOUDINARY_API_0PML8vXLvyowgl2dhwHaZiJVlcl
});

// Création du dossier de stockage permanent dans le cloud
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'chermical-produits',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

module.exports = multer({ storage: storage }).single('image');


// const multer =require('multer'); 
// const MIME_TYPES ={
//     'image/jpg':'jpg',
//     'image/jpeg' :'jpg',
//     'imgage/png' :'png'
// }

// const storage = multer.diskStorage ({
//     destination: (req, file, callback) => {
//         callback(null, 'images')
//     },
//     filename:(req, file, callback) => {
//         const name = file.originalname.split('').join('_');
//         const extension = MIME_TYPES[file.mimetype];
//         callback(null, name + Date.now() +'.'+ extension)
//     }

// });
// module.exports = multer ({storage: storage}).single('imageUrl');