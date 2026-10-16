const Thing = require('../models/thing');
const fs = require('fs')
const Comment = require('../models/comment');
const Visit = require('../models/visit');
// creation d'un nouveau objet
exports.createThing = (req, res, next) => {
    let thingObject = { ...req.body };

    // 🎯 MAGIC CLEANING FUNCTION FOR INGREDIENTS & BENEFITS
    const cleanMalformedArray = (input) => {
        if (!input) return [];
        
        // If it's already an array, convert it to a string first to unlock it
        let processingString = Array.isArray(input) ? input.join(',') : input;
        
        try {
            // Clean up accidental double encodings, bad brackets, and extra quotes
            processingString = processingString
                .replace(/^\[\s*'|'\s*\]$/g, '') // Removes trailing [' and ']
                .replace(/\\"/g, '"')            // Fixes escaped quotes
                .replace(/'/g, '"');             // Converts single quotes to double quotes
            
            // Re-wrap in brackets if they were stripped out
            if (!processingString.startsWith('[')) processingString = '[' + processingString;
            if (!processingString.endsWith(']')) processingString = processingString + ']';
            
            const parsed = JSON.parse(processingString);
            if (Array.isArray(parsed)) {
                return parsed.map(item => item.trim().replace(/^"|"$/g, ''));
            }
        } catch (e) {
            // Fallback: if JSON parsing completely fails, split by comma manually
            return processingString
                .replace(/[\[\]"']/g, '')
                .split(',')
                .map(item => item.trim())
                .filter(Boolean);
        }
        return [];
    };

    // Apply the clean fix to both fields!
    if (thingObject.ingredient) {
        thingObject.ingredient = cleanMalformedArray(thingObject.ingredient);
    }
    if (thingObject.bienfaits) {
        thingObject.bienfaits = cleanMalformedArray(thingObject.bienfaits);
    }

    // Your existing code remains the same...
    if (thingObject.price) thingObject.price = Number(thingObject.price);
    delete thingObject._id;

    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré avec succès !' }))
        .catch(error => res.status(400).json({ error: error.message }));
};


// selectioner un objet 
exports.getOneThing = (req, res, next) => {
  Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error: error.message }));}
    // selectioner l'objet le plus populaire
exports.getTopProduct = (req, res, next) => {
  Thing.findOne()
    .sort({ rating: -1 }) // 🎯 Tri du mieux noté au moins bien noté
    .then(thing => {
      if (!thing) return res.status(404).json({ message: "Aucun produit trouvé." });
      res.status(200).json(thing);
    })
    .catch(error => res.status(500).json({ error: error.message }));
};

//modifier un objet 
exports.modifyThing = (req, res, next) => {
    // 1. Cloner les données textuelles reçues
    let thingObject = { ...req.body };

    // 2. Reconvertir les chaînes JSON en vrais tableaux JavaScript (si présents)
    if (thingObject.ingredient) thingObject.ingredient = JSON.parse(thingObject.ingredient);
    if (thingObject.bienfaits) thingObject.bienfaits = JSON.parse(thingObject.bienfaits);
    
    // 3. Conversion sécurisée du prix
    if (thingObject.price) thingObject.price = Number(thingObject.price);

    // 4. Nettoyage des valeurs parasites "undefined" envoyées par le FormData
    if (thingObject.rating === undefined || thingObject.rating === 'undefined') delete thingObject.rating;
    if (thingObject.commentCount === undefined || thingObject.commentCount === 'undefined') delete thingObject.commentCount;

    // 5. Gestion de l'image optionnelle
    if (req.file) {
        thingObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    }

    // 🎯 6. ETAPE CLÉ : On va chercher les commentaires AVANT de sauvegarder le produit
    Comment.find({ productId: req.params.id, status: 'approved' })
        .then(comments => {
            const commentCount = comments.length;
            const averageRating = commentCount > 0 
                ? comments.reduce((acc, curr) => acc + curr.rating, 0) / commentCount 
                : 4.5; 

            // On injecte directement les statistiques fraîches dans notre objet de modification
            thingObject.rating = Math.round(averageRating * 10) / 10;
            thingObject.commentCount = commentCount;

            console.log("Objet final envoyé à MongoDB :", thingObject);

            // 🎯 7. UN SEUL APPEL À MONGO DB AVEC L'OPÉRATEUR $set
            Thing.updateOne({ _id: req.params._id }, { $set: thingObject })
                .then((result) => {
                    console.log("Résultat brut de la mise à jour MongoDB :", result);
                    
                    // Sécurité : on renvoie un message clair au frontend
                    return res.status(200).json({ 
                        message: 'Produit modifié avec succès !', 
                        matchedCount: result.matchedCount,
                        modifiedCount: result.modifiedCount 
                    });
                })
                .catch(error => res.status(400).json({ error: "Erreur updateOne : " + error.message }));
        })
        .catch(error => res.status(500).json({ error: "Erreur findComments : " + error.message }));
};


// exports.modifyThing = (req, res, next) => {
//     console.log("Données reçues dans req.body :", req.body);
//     console.log("Fichier reçu dans req.file :", req.file);
//    const thingObject = req.file ? {
//        ...JSON.parse(req.body.thing),
//        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//    } : { ...req.body };
 
//    delete thingObject._userId;
//    Thing.findOne({_id: req.params.id})
//        .then((thing) => {
//            if (thing.userId != req.auth.userId) {
//                res.status(401).json({ message : 'Not authorized'});
//            } else {
//                Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
//                .then(() => res.status(200).json({message : 'Objet modifié!'}))
//                .catch(error => res.status(401).json({ error }));
//            }
//        })
//        .catch((error) => {res.status(400).json({ error });});
// };


// exports.deleteThing = (req, res, next) => {
//     Thing.findOne({ _id: req.params.id })
//         .then(thing => {
//             if (!thing) {
//                 return res.status(404).json({ error: "Produit non trouvé !" });
//             }

//             // 🎯 CORRECTION DE L'INDEX : .split() crée un tableau, on prend l'index 1 pour avoir le nom du fichier
//             const filename = thing.imageUrl.split('/images/')[1];

//             // On supprime le fichier du disque dur
//             fs.unlink(`images/${filename}`, (err) => {
//                 if (err) {
//                     console.error("Impossible de supprimer le fichier image physique :", err.message);
//                     // On continue quand même pour supprimer le texte de la base de données
//                 }

//                 // On supprime le document de MongoDB
//                 Thing.deleteOne({ _id: req.params.id })
//                     .then(() => res.status(200).json({ message: 'Produit supprimé avec succès !' }))
//                     .catch(error => res.status(400).json({ error: error.message }));
//             });
//         })
//         .catch(error => res.status(500).json({ error: error.message }));
// };


 // 💡 IMPORTATION : Ajoutez le modèle Comment

exports.deleteThing = (req, res, next) => {
    // 1. On cherche le produit pour obtenir son image
    Thing.findOne({ _id: req.params.id })
        .then(thing => {
            if (!thing) {
                return res.status(404).json({ error: "Produit non trouvé !" });
            }

            const filename = thing.imageUrl.split('/images/')[1];

            // 2. On supprime le fichier physique du disque
            fs.unlink(`images/${filename}`, (err) => {
                if (err) {
                    console.error("Impossible de supprimer l'image physique :", err.message);
                }

                // 3. On supprime le produit de la collection 'Things'
                Thing.deleteOne({ _id: req.params.id })
                    .then(() => {
                        
                        // 🎯 4. NOUVEAU : On supprime tous les commentaires liés à ce productId
                        Comment.deleteMany({ productId: req.params.id })
                            .then(() => {
                                console.log(`Commentaires liés au produit ${req.params.id} supprimés.`);
                                res.status(200).json({ message: 'Produit et ses commentaires supprimés avec succès !' });
                            })
                            .catch(error => res.status(500).json({ error: "Erreur suppression commentaires: " + error.message }));
                            
                    })
                    .catch(error => res.status(400).json({ error: error.message }));
            });
        })
        .catch(error => res.status(500).json({ error: error.message }));
};



// exports.deleteThing = (req, res, next) => {
//    Thing.findOne({ _id: req.params.id})
//        .then(thing => {
//            if (thing.userId != req.auth.userId) {
//                res.status(401).json({message: 'Not authorized'});
//            } else {
//                const filename = thing.imageUrl.split('/images/')[1];
//                fs.unlink(`images/${filename}`, () => {
//                    Thing.deleteOne({_id: req.params.id})
//                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
//                        .catch(error => res.status(401).json({ error }));
//                });
//            }
//        })
//        .catch( error => {
//            res.status(500).json({ error });
//        });
// };
exports.getAllStuff=(req, res, next) => {
  Thing.find()
  .then((things) => {res.status(200).json(things);})
  .catch((error) => {res.status(400).json({error: error});});
};

// ✅ Ajoutez ceci tout à la fin de votre fichier controllers/thing.js

exports.getDashboardStats = async (req, res, next) => {
    try {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // 🎯 AJOUTER CETTE FONCTION ICI POUR CORRIGER L'ERREUR :
        const extractStats = (data) => {
            // Permet d'extraire les données du tableau d'agrégation MongoDB $facet
            const total = data[0]?.total[0]?.count || 0;
            const thisMonth = data[0]?.thisMonth[0]?.count || 0;
            const lastMonth = data[0]?.lastMonth[0]?.count || 0;
            
            let percentage = 0;
            if (lastMonth > 0) {
                percentage = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
            } else if (thisMonth > 0) {
                percentage = 100; // 100% de croissance si aucun élément le mois précédent
            }
            return { total, percentage };
        };

        const facetPipeline = [
            {
                $facet: {
                    total: [{ $count: "count" }],
                    thisMonth: [{ $match: { createdAt: { $gte: startOfThisMonth } } }, { $count: "count" }],
                    lastMonth: [{ $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } }, { $count: "count" }]
                }
            }
        ];

        // Exécution de vos requêtes d'agrégation existantes
        const productData = await Thing.aggregate(facetPipeline);
        const commentData = await Comment.aggregate(facetPipeline);
        const viewData = await Visit.aggregate(facetPipeline);

        // Pipeline spécifique pour les adresses IP uniques (Visiteurs)
        const visitorData = await Visit.aggregate([
            {
                $facet: {
                    total: [{ $group: { _id: "$ipAddress" } }, { $count: "count" }],
                    thisMonth: [{ $match: { createdAt: { $gte: startOfThisMonth } } }, { $group: { _id: "$ipAddress" } }, { $count: "count" }],
                    lastMonth: [{ $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } }, { $group: { _id: "$ipAddress" } }, { $count: "count" }]
                }
            }
        ]);

        // Extraction propre grâce à notre fonction utilitaire réparée
        const productStats = extractStats(productData);
        const commentStats = extractStats(commentData);
        const viewStats = extractStats(viewData);

        // Extraction des visiteurs (qui utilisent la même structure de tableau)
        const extractUniqueStats = (data) => {
            const total = data[0]?.total[0]?.count || 0;
            const thisMonth = data[0]?.thisMonth[0]?.count || 0;
            const lastMonth = data[0]?.lastMonth[0]?.count || 0;
            let percentage = 0;
            if (lastMonth > 0) percentage = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
            else if (thisMonth > 0) percentage = 100;
            return { total, percentage };
        };
        const visitorStats = extractUniqueStats(visitorData);

        // 💡 Vos deux listes d'activité récente et de popularité
        let recentComments = await Comment.find()
    .sort({ createdAt: -1 })
    .limit(3);

// This forces Mongoose to manually populate the path, even if the runtime is behaving as raw objects
recentComments = await Comment.populate(recentComments, { 
    path: 'productId', 
    select: 'nom' 
});

        const popularProducts = await Thing.find()
            .sort({ rating: -1 })
            .limit(3);

        // Réponse finale envoyée au Frontend 🚀
        res.status(200).json({
            products: productStats,
            comments: commentStats,
            views: viewStats,
            visitors: visitorStats,
            recentComments: recentComments,
            popularProducts: popularProducts
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




