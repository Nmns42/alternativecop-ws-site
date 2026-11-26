# Politique de sécurité

## Signaler une vulnérabilité

Merci de **ne pas ouvrir d'issue publique** pour un problème de sécurité.
Écrivez à **copwesternsahara@gmail.com** (objet : « Sécurité site »), ou utilisez
le signalement privé de GitHub (onglet *Security* > *Report a vulnerability*).

Nous accusons réception sous 7 jours.

## Périmètre

- Site statique servi sur https://nmns42.github.io/alternativecop-ws-site/ (GitHub Pages).
- Aucune base de données, aucun code serveur, aucun cookie ni traceur.
- Politique de sécurité du contenu (CSP) stricte : seuls les fichiers du site sont chargés.

## Règles du dépôt

- Dépôt public : aucun secret, jeton, mot de passe ni fichier interne (`cloud.md`, `CLAUDE.md`, `.env`…).
- Ces fichiers sont bloqués par `.gitignore`, par un hook local (`.githooks/pre-commit`)
  et par le workflow `Contrôles de sécurité`.
