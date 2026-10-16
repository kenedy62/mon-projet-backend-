const Comment = require('../models/comment');
const Thing = require('../models/thing');


// 1. Poster un commentaire
exports.createComment = (req, res, next) => {
  const comment = new Comment({
    productId: req.body.productId,
    author: req.body.author,
    text: req.body.text,
    rating: Number(req.body.rating)
  });

  comment.save()
    .then(() => {
      // MÀJ des statistiques du produit (Note moyenne + Nombre de commentaires)
      Comment.find({ productId: req.body.productId })
        .then(comments => {
          const commentCount = comments.length;
          const averageRating = comments.reduce((acc, curr) => acc + curr.rating, 0) / commentCount;

          // On arrondi à une décimale (ex: 4.3)
          const roundedRating = Math.round(averageRating * 10) / 10;

          // Sauvegarde dans le produit
          Thing.updateOne(
            { _id: req.body.productId },
            { $set: { rating: roundedRating, commentCount: commentCount } }
          )
            .then(() => res.status(201).json({ message: 'Commentaire ajouté et produit mis à jour !' }))
            .catch(error => res.status(500).json({ error }));
        });
    })
    .catch(error => res.status(400).json({ error }));
};

// 2. Récupérer les commentaires d'un produit spécifique
exports.getCommentsByProduct = (req, res, next) => {
  Comment.find({ productId: req.params.productId }).sort({ createdAt: -1 }) // Du plus récent au plus ancien
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(404).json({ error }));
};

// 1. Récupération PUBLIQUE : Uniquement les commentaires approuvés 🎯
exports.getApprovedComments = (req, res, next) => {
  Comment.find({ productId: req.params.productId, status: 'approved' }).sort({ createdAt: -1 })
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(404).json({ error }));
};

// 2. Récupération ADMIN : Tous les commentaires pour l'interface de modération 🛠️
exports.getAllCommentsForAdmin = (req, res, next) => {
  Comment.find().populate('productId', 'nom') // Permet de récupérer le titre du produit associé
    .then(comments => res.status(200).json(comments))
    .catch(error => res.status(500).json({ error }));
};

// 3. Action de MODÉRATION (Approuver / Rejeter) ⚖️
exports.moderateComment = (req, res, next) => {
  const { status } = req.body; // 'approved' ou 'rejected'

  Comment.findOneAndUpdate({ _id: req.params.id }, { $set: { status: status } }, { new: true })
    .then(updatedComment => {
      // 💡 Recalculer la note moyenne UNIQUEMENT basée sur les commentaires approuvés du produit
      Comment.find({ productId: updatedComment.productId, status: 'approved' })
        .then(comments => {
          const commentCount = comments.length;
          const averageRating = commentCount > 0 
            ? comments.reduce((acc, curr) => acc + curr.rating, 0) / commentCount 
            : 4.5; // Note par défaut s'il n'y a plus d'avis approuvés

          const roundedRating = Math.round(averageRating * 10) / 10;

          // Mettre à jour la fiche produit
          Thing.updateOne(
            { _id: updatedComment.productId },
            { $set: { rating: roundedRating, commentCount: commentCount } }
          )
            .then(() => res.status(200).json({ message: `Commentaire ${status} avec succès !` }))
            .catch(error => res.status(500).json({ error }));
        });
    })
    .catch(error => res.status(400).json({ error }));
};
