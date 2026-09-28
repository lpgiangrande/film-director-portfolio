# PORTFOLIO WEBSITE WITH A CONTENT MANAGEMENT SYSTEM

## Live site

(https://www.regisraffin.com/).

## Built with

- Backend : Nodejs & Expressjs, MongoDB & Mongoose
- Frontend : html, css, bootstrap 5, ejs, javaScript


## Déploiement

**Sur le Mac** 

git add . && git commit -m "message clair" && git push

**Sur le serveur Lightsail** (connexion via la console AWS) :

cd ~/htdocs/film-director-portfolio
git pull
npm install        # seulement si package.json a changé
pm2 restart all


**En cas de souci** : `git fetch && git status` pour voir si le serveur a du retard, puis recharger avec Cmd + Shift + R.