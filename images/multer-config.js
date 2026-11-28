const multer = require('multer');

// Stockage temporaire en mémoire (nécessaire pour envoyer le buffer à ImageKit)
const storage = multer.memoryStorage();

module.exports = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // Limite à 10 Mo
}).single('imageUrl');



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