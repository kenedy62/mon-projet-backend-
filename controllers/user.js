const { JsonWebTokenError } = require('jsonwebtoken');
const User =require ('../models/user');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    //console.log(User.email);
   User.findOne({ email: req.body.email })
       .then(user => {
           if (!user) {
            console.log('Utilisateur non trouve')
               return res.status(401).json({ error: 'Utilisateur non trouvé !' });
               console.log(user)
                console.log('ici1')
           }
           bcrypt.compare(req.body.password, user.password)
               .then(valid => {
                   if (!valid) {
                    console.log('Mots de passe incorect')
                       return res.status(401).json({ error: 'Mot de passe incorrect !' });
                       console.log('Mots de passe incorect')
                   }
                   res.status(200).json({
                       userId: user._id,    
                       token: jwt.sign(
                           { userId: user._id },
                           'RANDOM_TOKEN_SECRET',
                           { expiresIn: '24h'}
                       )                                                    
                   });
                   console.log(user)
               })
               .catch(error => res.status(500).json({ error }));
       })
       .catch(error => res.status(500).json({ error }));
};

// 1. Récupérer le profil actuel (E-mail et WhatsApp)
exports.getSettings = (req, res) => {
  User.findOne()
    .then(user => {
      if (!user) return res.status(404).json({ error: "Aucun compte administrateur trouvé." });
      res.status(200).json({ email: user.email, whatsappNumber: user.whatsappNumber, facebookUrl: user.facebookUrl  });
    })
    .catch(error => res.status(500).json({ error }));
};

// 2. Mettre à jour les informations du profil (E-mail, WhatsApp, Password)
exports.updateSettings = (req, res) => {
      if (!req.body) {
    return res.status(400).json({ error: "Le corps de la requête (body) est vide ou mal configuré." });
  }
  const { email, whatsappNumber, facebookUrl,currentPassword, newPassword } = req.body;

  // req.auth.userId doit être fourni par votre middleware d'authentification existant
  User.findOne({ _id: req.auth.userId })
    .then(user => {
      if (!user) return res.status(404).json({ error: "Administrateur non trouvé." });

      let updateData = {};

      // Mise à jour de l'e-mail si fourni
      if (email) updateData.email = email;

      // Mise à jour du numéro WhatsApp si fourni (nettoyage des caractères parasites)
      if (whatsappNumber) {
        updateData.whatsappNumber = whatsappNumber.replace(/[\s\+]/g, '');
      }
      if (facebookUrl) updateData.facebookUrl = facebookUrl.trim();

      // Si l'administrateur souhaite changer son mot de passe
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: "Le mot de passe actuel est requis pour le modifier." });
        }

        return bcrypt.compare(currentPassword, user.password)
          .then(valid => {
            if (!valid) return res.status(401).json({ error: "Mot de passe actuel incorrect." });

            return bcrypt.hash(newPassword, 10)
              .then(hash => {
                updateData.password = hash;
                return User.updateOne({ _id: user._id }, { $set: updateData })
                  .then(() => res.status(200).json({ message: "Profil et mot de passe mis à jour avec succès !" }));
              });
          });
      }

      // Si modification uniquement de l'e-mail ou du WhatsApp sans toucher au mot de passe
      User.updateOne({ _id: user._id }, { $set: updateData })
        .then(() => res.status(200).json({ message: "Informations de profil mises à jour avec succès !" }))
        .catch(error => res.status(400).json({ error: error.message }));
    })
    .catch(error => res.status(500).json({ error: error.message }));
};
