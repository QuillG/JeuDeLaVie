# Jeu de la Vie – Application Desktop (Vue.js + Electron)

## Objectif du projet

Application desktop développée en **Vue.js + Electron** dans le cadre du module **Développement Natif – M2 DEV**.

Elle implémente le **Jeu de la Vie** de John Conway : visualisation de la grille, évolution en temps réel, configuration personnalisée et sauvegardes.

---

## Installation

### Prérequis
- **Node.js 18+**
- **npm**
- Compatible Windows / macOS / Linux

### Installation du projet

```bash
git clone https://github.com/<TON_COMPTE>/JeuDeLaVie.git
cd JeuDeLaVie
npm install
```

---

## Lancer l’application

### Mode développement (avec debug)

Activation automatique du mode debug (pas-à-pas activé) :

```bash
npm run dev
```

- Vue + Electron en mode développement  
- Rechargement à chaud  
- Pas à pas

---

## Construire l’application (release)

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

## Versionning et mise à jour

Les versions majeures de l'application (**2.0.0**, **3.0.0**) sont
publiées dans l'onglet **Releases** du dépôt GitHub.

Pour créer une nouvelle release :

1.  Créer un tag et une release GitHub\
2.  Indiquer le numéro de version (sémantique)\
3.  La CI se déclenche automatiquement\
4.  L'installateur final est généré et ajouté aux **assets** de la
    release

### Fonctionnement actuel

Lors de l'installation, l'installateur NSIS détecte automatiquement
qu'une version de l'application est déjà installée\
(comportement par défaut de `electron-builder + NSIS`).\
L'utilisateur est alors averti qu'une installation existe déjà.

------------------------------------------------------------------------

## Implémentation future : afficher la version précédente

Pour l'instant, l'application **ne lit pas encore** la version détaillée
déjà installée.\
Voici comment cette fonctionnalité pourra être ajoutée plus tard avec
**electron-builder** et **NSIS**.

### 1. Stocker la version installée dans le registre Windows

NSIS peut écrire la version courante dans une clé du registre :

    HKCU\Software\JeuDeLaVie\Version

Cette écriture peut être ajoutée via un petit script personnalisé.

------------------------------------------------------------------------

### 2. Lire et afficher la version existante

En ajoutant un fichier :

    build/installer.nsh

avec par exemple :

``` nsh
!macro preInit
  ReadRegStr $0 HKCU "Software\JeuDeLaVie" "Version"
  StrCmp $0 "" no_old
    MessageBox MB_OK "Version déjà installée : $0"
  no_old:
!macroend
```

L'installateur pourra afficher explicitement la version actuellement
installée.

------------------------------------------------------------------------

### 3. Activer le script dans `electron-builder.yml`

``` yaml
nsis:
  script: build/installer.nsh
```

------------------------------------------------------------------------

## Résultat attendu (pour plus tard)

Une fois activé, le système permettra de :

-   Détecter l'installation existante\
-   Lire la version déjà installée\
-   L'afficher à l'utilisateur (ex : « Version installée : 2.0.0 »)\
-   Proposer une mise à jour propre


