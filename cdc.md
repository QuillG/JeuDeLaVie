# Cahier des Charges – Jeu de la Vie

## 1. Contexte / Objectifs

Le **Jeu de la Vie** est un automate cellulaire imaginé par **John Conway**.  
Ce projet vise à concevoir une **application desktop multi-plateforme** (Windows / Linux / macOS) simulant l’évolution d’une population de cellules vivantes et mortes selon des règles simples.

L’objectif principal est d’offrir une **simulation visuelle et interactive**, en plusieurs étapes d’évolution, jusqu’à une interface complète développée avec **Vue.js** et **Electron**.

---

## 2. Objectifs du projet

- Implémenter le **moteur de simulation** du Jeu de la Vie.  
- Créer une **interface graphique (IHM)** avec Vue.js + Electron.  
- Permettre le **chargement et la sauvegarde** de configurations locales (`.json`).  
- Introduire une **interopérabilité** avec un format standard du Jeu de la Vie.  
- Offrir une expérience fluide, claire et ergonomique.

---

## 3. Exigences / Spécifications

### 3.1 Fonctionnelles

| Priorité | Exigence | Description |
|-----------|-----------|-------------|
| 🔴 Haute | Simulation du Jeu de la Vie | Implémenter les règles de base : survie, mort, naissance. |
| 🔴 Haute | Grille dynamique | Taille configurable (ex. 20×20 à 100×100). |
| 🟠 Moyenne | Interface graphique (Vue + Electron) | Contrôles : lecture, pause, réinitialisation, vitesse, zoom. |
| 🟠 Moyenne | Chargement / Sauvegarde | Fichiers `.json` stockés localement (v1.0.0). |
| 🟢 Basse | Sélection manuelle des cellules | Activation/désactivation par clic. |
| 🟢 Basse | Patterns connus | Chargement de structures célèbres : Glider, Pulsar, etc. |
| 🟢 Basse | Statistiques | Affichage du nombre de cellules vivantes et du nombre de générations. |

### 3.2 Non-fonctionnelles

- **Technologies** : Vue.js + Electron (pour la version graphique), Node.js pour la logique.  
- **Gestionnaire de paquets** : `npm` (compatible Electron).  
- **Langage** : JavaScript / TypeScript.  
- **Plateformes cibles** : Windows, Linux, macOS.  
- **Performance** : simulation fluide jusqu’à 100×100 cellules.  
- **Lisibilité** : interface claire, responsive et ergonomique.  
- **Versionnement** : SemVer (v1.0.0, v2.0.0, etc.).

---

## 4. Itérations / Planning

| Version | Objectifs principaux | Détails |
|----------|----------------------|----------|
| **v1.0.0** | **Application desktop de base (Vue + Electron)** | - Moteur du jeu fonctionnel.<br> - Simulation aléatoire et affichage graphique.<br> - Contrôles : lecture, pause, réinitialisation.<br> - Grille dynamique (taille paramétrable).<br> - Sauvegarde/chargement en format `.json` local.<br> - Tests unitaires sur la logique des règles. |
| **v2.0.0** | **Interopérabilité et fonctionnalités avancées** | - Support d'un format standard<br> - Ajout de patterns connus (Glider, Pulsar…).<br> - Sélection manuelle des cellules.<br> - Statistiques : cellules vivantes, générations.<br> - Optimisations de performance. |

> **Remarque :**  
> Le passage du format `.json` (v1.0.0) à un format standard (v2.0.0) marque une **rupture technique planifiée** pour assurer la compatibilité avec d’autres simulateurs tels que *Golly* ou *LifeViewer*.

---

## 5. Architecture logicielle

### 5.1 Schéma simplifié

```text
┌─────────────────────────────────┐
│ Application (Vue.js + Electron) │
└───────────────┬─────────────────┘
                │
                ▼
┌────────────────────────────────────┐
│ Grille ←→ Cellules vivantes/mortes │
└───────────────┬────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Moteur de simulation (règles) │ 
└───────────────┬───────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│ Interface utilisateur (contrôles, vue) │ 
└───────────────┬────────────────────────┘

