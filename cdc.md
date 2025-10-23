# Cahier des Charges – Jeu de la Vie

## 1. Contexte / Objectifs

Le **Jeu de la Vie** est un automate cellulaire imaginé par **John Conway**.  
Ce projet vise à concevoir une **application desktop multi-plateforme** (Windows / Linux / macOS) simulant l’évolution d’une population de cellules vivantes et mortes selon des règles simples.

L’objectif principal est d’offrir une **simulation visuelle et interactive**, en plusieurs étapes d’évolution, depuis une base console (CLI) jusqu’à une interface complète développée avec **Vue.js** et **Electron**.

---

## 2. Objectifs du projet

- Implémenter le **moteur de simulation** du Jeu de la Vie.
- Offrir une **interface en ligne de commande (CLI)** pour tester et déboguer la logique.
- Créer ensuite une **interface graphique (IHM)** avec Vue.js + Electron.
- Permettre le **chargement et la sauvegarde** de configurations.
- Introduire une **interopérabilité** avec des formats standards du Jeu de la Vie (Life 1.05, RLE, Macrocell).
- Offrir une expérience fluide, claire et ergonomique.

---

## 3. Exigences / Spécifications

### 3.1 Fonctionnelles

| Priorité | Exigence | Description |
|-----------|-----------|-------------|
| 🔴 Haute | Simulation du Jeu de la Vie | Implémenter les règles de base (survie, mort, naissance). |
| 🔴 Haute | Mode CLI (v0.1) | Lancer une simulation aléatoire via le terminal pour valider la logique. |
| 🔴 Haute | Grille dynamique | Taille configurable (ex. 20×20 à 100×100). |
| 🟠 Moyenne | Chargement / Sauvegarde | Utilisation d’un format interne (`.json`) dans la version 1.0.0. |
| 🟠 Moyenne | Interface graphique (Vue + Electron) | Contrôles : lecture, pause, réinitialisation, vitesse, zoom. |
| 🟢 Basse | Formats standards (RLE, Life 1.05, Macrocell) | Compatibilité avec d’autres simulateurs (à partir de la v2.0.0). |
| 🟢 Basse | Sélection manuelle des cellules | Possibilité de cliquer sur la grille pour activer/désactiver des cases. |
| 🟢 Basse | Patterns connus | Chargement de structures célèbres : Glider, Pulsar, etc. |
| 🟢 Basse | Statistiques | Nombre de cellules vivantes, générations, etc. |

---

### 3.2 Non-fonctionnelles

- **Technologies** : Vue.js + Electron (pour la version graphique), Node.js pour la logique.  
- **Gestionnaire de paquets** : `pnpm` (rapide, efficace et compatible Electron).  
- **Langage** : JavaScript / TypeScript.  
- **Plateformes cibles** : Windows, Linux, macOS.  
- **Performance** : Simulation fluide jusqu’à 100×100 cellules.  
- **Lisibilité** : Interface claire, responsive et ergonomique.  
- **Versionnement** : SemVer (v1.0.0, v2.0.0, etc.).  

---

## 4. Itérations / Planning

| Version | Objectifs principaux | Détails |
|----------|----------------------|----------|
| **v0.1.0** | **Prototype CLI (console)** | - Moteur du jeu fonctionnel.<br> - Simulation aléatoire.<br> - Affichage texte dans le terminal.<br> - Test unitaire des règles. |
| **v1.0.0** | **Application desktop (Vue + Electron)** | - Interface graphique de base.<br> - Grille dynamique et simulation visuelle.<br> - Contrôles : lecture, pause, réinitialisation.<br> - Sauvegarde/chargement en format interne (`.json`). |
| **v2.0.0** | **Interopérabilité et fonctionnalités avancées** | - Support des formats standards (RLE, Life 1.05, Macrocell).<br> - Abandon du `.json` interne (breaking change planifié).<br> - Ajout des patterns connus.<br> - Sélection manuelle des cellules.<br> - Statistiques (cellules vivantes, générations). |

> **Remarque :**  
> Le passage du format `.json` (v1.0.0) à un format standard (v2.0.0) marque une **rupture technique planifiée** visant à rendre le projet compatible avec d’autres simulateurs comme Golly ou LifeViewer.  

---

## 5. Architecture logicielle

### Schéma simplifié

+---------------------------+
| Application |
| (Vue.js + Electron) |
+---------------------------+
|
v
+---------------------------+
| Grille | <----> Cellule (vivante/morte)
+---------------------------+
|
v
+---------------------------+
| Moteur de simulation |
| (application des règles) |
+---------------------------+
|
v
+---------------------------+
| Interface utilisateur |
| (affichage et contrôles) |
+---------------------------+

### Structure prévue (MVC)

- **Modèle (Model)** : cellules, grille, génération, état du jeu.  
- **Vue (View)** : affichage via Vue.js et Electron.  
- **Contrôleur (Controller)** : logique de simulation, gestion des itérations et des événements utilisateur.  

---

## 6. Choix techniques

| Élément | Choix | Justification |
|----------|--------|----------------|
| **Langage** | JavaScript / TypeScript | Simplicité et compatibilité Electron/Vue. |
| **Framework UI** | Vue.js | Léger, réactif et modulaire. |
| **Container desktop** | Electron | Multi-plateforme et facile à packager. |
| **Gestionnaire de paquets** | pnpm | Rapidité et gestion optimisée des dépendances. |
| **Format initial de sauvegarde** | JSON | Simple et rapide à implémenter pour la v1.0.0. |
| **Format futur** | RLE / Life 1.05 | Compatibilité avec les simulateurs standards. |

---