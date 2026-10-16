const Option = require('../models/option');

// 1. Récupérer toutes les options (Public & Admin)
exports.getAllOptions = (req, res) => {
  Option.find()
    .then(options => res.status(200).json(options))
    .catch(error => res.status(500).json({ error }));
};

// 2. Créer une nouvelle option
exports.createOption = (req, res) => {
  // Safety check to ensure req.body exists
  if (!req.body || !req.body.name) {
    return res.status(400).json({ error: "Missing payload data or body parser is misconfigured." });
  }

  const option = new Option({
    name: req.body.name,
    type: req.body.type
  });

  option.save()
    .then(() => res.status(201).json({ message: 'Option enregistrée !' }))
    .catch(error => res.status(400).json({ error }));
};


// 3. Modifier une option
exports.updateOption = (req, res) => {
  // 🎯 SÉCURITÉ : On vérifie que req.body existe bien avant de lire
  if (!req.body || !req.body.name) {
    return res.status(400).json({ error: "Le champ 'name' est requis pour la modification." });
  }

  // Mise à jour de l'option dans MongoDB
  Option.updateOne({ _id: req.params.id }, { $set: { name: req.body.name } })
    .then(() => res.status(200).json({ message: 'Option modifiée avec succès !' }))
    .catch(error => res.status(400).json({ error }));
};


// 4. Supprimer une option
exports.deleteOption = (req, res) => {
  Option.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Option supprimée !' }))
    .catch(error => res.status(400).json({ error }));
};
