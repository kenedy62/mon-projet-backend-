const Admin = require('../models/user');
const bcrypt = require('bcrypt');

// 1. Récupérer le profil actuel (E-mail et WhatsApp)
exports.getSettings = (req, res) => {
  Admin.findOne()
    .then(admin => {
      if (!admin) return res.status(404).json({ error: "Aucun compte administrateur trouvé." });
      res.status(200).json({ email: admin.email, whatsappNumber: admin.whatsappNumber });
    })
    .catch(error => res.status(500).json({ error }));
};

// 2. Mettre à jour les informations du profil (E-mail, WhatsApp, Password)
exports.updateSettings = (req, res) => {
  const { email, whatsappNumber, currentPassword, newPassword } = req.body;

  // req.auth.userId doit être fourni par votre middleware d'authentification existant
  Admin.findOne({ _id: req.auth.userId })
    .then(admin => {
      if (!admin) return res.status(404).json({ error: "Administrateur non trouvé." });

      let updateData = {};

      // Mise à jour de l'e-mail si fourni
      if (email) updateData.email = email;

      // Mise à jour du numéro WhatsApp si fourni (nettoyage des caractères parasites)
      if (whatsappNumber) {
        updateData.whatsappNumber = whatsappNumber.replace(/[\s\+]/g, '');
      }

      // Si l'administrateur souhaite changer son mot de passe
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: "Le mot de passe actuel est requis pour le modifier." });
        }

        return bcrypt.compare(currentPassword, admin.password)
          .then(valid => {
            if (!valid) return res.status(401).json({ error: "Mot de passe actuel incorrect." });

            return bcrypt.hash(newPassword, 10)
              .then(hash => {
                updateData.password = hash;
                return Admin.updateOne({ _id: admin._id }, { $set: updateData })
                  .then(() => res.status(200).json({ message: "Profil et mot de passe mis à jour avec succès !" }));
              });
          });
      }

      // Si modification uniquement de l'e-mail ou du WhatsApp sans toucher au mot de passe
      Admin.updateOne({ _id: admin._id }, { $set: updateData })
        .then(() => res.status(200).json({ message: "Informations de profil mises à jour avec succès !" }))
        .catch(error => res.status(400).json({ error: error.message }));
    })
    .catch(error => res.status(500).json({ error: error.message }));
};
