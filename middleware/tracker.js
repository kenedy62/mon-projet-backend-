const Visit = require('../models/visit');

module.exports = (req, res, next) => {
    // On extrait l'adresse IP du visiteur (gestion du proxy incluse)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];

    // Enregistrement silencieux en base de données
    const visit = new Visit({ ipAddress: ip, userAgent: ua });
    visit.save()
        .then(() => next())
        .catch(err => {
            console.error("Erreur d'enregistrement du tracker :", err.message);
            next(); // On passe quand même à la suite pour ne pas bloquer le client
        });
};
