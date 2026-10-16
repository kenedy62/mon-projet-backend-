// const Thing = require('../models/Thing');
// const Comment = require('../models/comment');

// exports.getDashboardStats = async (req, res, next) => {
//     try {
//         const now = new Date();
//         const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//         const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

//         // 🎯 Fonction générique pour compter le total et calculer la croissance mensuelle
//         const getStatsForCollection = async (Model) => {
//             const data = await Model.aggregate([
//                 {
//                     $facet: {
//                         total: [{ $count: "count" }],
//                         thisMonth: [
//                             { $match: { createdAt: { $gte: startOfThisMonth } } },
//                             { $count: "count" }
//                         ],
//                         lastMonth: [
//                             { $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } } },
//                             { $count: "count" }
//                         ]
//                     }
//                 }
//             ]);

//             const total = data[0].total[0]?.count || 0;
//             const thisMonthCount = data[0].thisMonth[0]?.count || 0;
//             const lastMonthCount = data[0].lastMonth[0]?.count || 0;

//             // Calcul du pourcentage : ((CeMois - MoisDernier) / MoisDernier) * 100
//             let percentage = 0;
//             if (lastMonthCount > 0) {
//                 percentage = Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
//             } else if (thisMonthCount > 0) {
//                 percentage = 100; // 100% de croissance si aucun élément le mois dernier
//             }

//             return { total, percentage };
//         };

//         // Extraction des statistiques MongoDB
//         const productStats = await getStatsForCollection(Thing);
//         const commentStats = await getStatsForCollection(Comment);

//         // 💡 Pour les vues et visiteurs (Données temporaires simulées en attendant votre tracker)
//         const viewStats = { total: 1420, percentage: 12 };
//         const visitorStats = { total: 850, percentage: 8 };

//         // Envoi de la réponse formatée
//         res.status(200).json({
//             products: productStats,
//             comments: commentStats,
//             views: viewStats,
//             visitors: visitorStats
//         });

//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
