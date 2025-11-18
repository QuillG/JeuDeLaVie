# Jeu de la Vie – Application Desktop (Vue.js + Electron)

## Objectif du projet

Ce projet a été réalisé dans le cadre du cours **Développement Natif – M2 DEV**.  
L’objectif est de concevoir et distribuer une **application de bureau** multiplateforme (Windows, macOS, Linux), développée avec **Vue.js** pour l’interface et **Electron** pour l’exécution native.

L’application implémente le célèbre **Jeu de la Vie** de John Conway, un automate cellulaire où chaque cellule d’une grille évolue selon un ensemble de règles simples.  
L’utilisateur peut visualiser l’évolution du système en temps réel et interagir avec la simulation.

---

## Installation et exécution

### Prérequis

- **Node.js 18+**
- **npm** (ou **yarn**)
- Système compatible avec Electron (Windows, macOS, Linux)

---

### Installation du projet

```bash
# Cloner le dépôt
git clone https://github.com/QuillG/JeuDeLaVie.git
cd JeuDeLaVie

# Installer les dépendances
npm install
```

### Exécution des versions
Version 1 – CLI

La première version du projet fonctionne entièrement dans le terminal.
Pour générer automatiquement une grille 50x50 puis lancer la simulation, utiliser la commande suivante :

```bash
npm run run:all
```

Cette commande exécute successivement :

```bash
node cli/generateGrid.js 50 50

node cli/index.js grid.json
```

Versions 2 et 3 – Interface graphique (Vue.js / Electron)

Les versions suivantes utilisent une interface Vue.js avec Electron.
Pour lancer l’application en mode développement :

```bash
npm run dev
```
