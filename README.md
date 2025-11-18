# 🧬 Jeu de la Vie – Application Desktop (Vue.js + Electron)

## 🎯 Objectif du projet

Application desktop développée en **Vue.js + Electron** dans le cadre du module **Développement Natif – M2 DEV**.

Elle implémente le **Jeu de la Vie** de John Conway : visualisation de la grille, évolution en temps réel, configuration personnalisée et sauvegardes.

---

## ⚙️ Installation

### 🔧 Prérequis
- **Node.js 18+**
- **npm**
- Compatible Windows / macOS / Linux

### 📦 Installation du projet

```bash
git clone https://github.com/<TON_COMPTE>/JeuDeLaVie.git
cd JeuDeLaVie
npm install
```

---

## 🚀 Lancer l’application

### ▶️ Mode développement (avec debug)

Activation automatique du mode debug (pas-à-pas activé) :

```bash
npm run dev
```

- Vue + Electron en mode développement  
- Rechargement à chaud  
- Pas à pas

---

## 🏗️ Construire l’application (release)

Pour générer l’installateur **.exe** (ou équivalent selon ton OS) :

```bash
npm run dist
```

Ce script réalise :

1. Build Vue en mode production  
2. Packaging Electron via `electron-builder`  
3. Sortie du build final dans :

```
build-release/
```

