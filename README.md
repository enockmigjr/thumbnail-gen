# 🚀 ThumbnailAI - Générateur de Miniatures YouTube Premium

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google-Gemini_3_Pro-4285F4?style=flat-square&logo=google-gemini)](https://ai.google.dev/)

**ThumbnailAI** est une application web ultra-performante conçue pour les créateurs de contenu souhaitant générer des miniatures percutantes en quelques secondes grâce à l'intelligence artificielle de Google Gemini.

Domaines
- thumbnail-gen-vert.vercel.app
- thumbnail-gen-git-master-enockmigjrs-projects.vercel.app
- thumbnail-5jaccwatd-enockmigjrs-projects.vercel.app
---

## ✨ Fonctionnalités Clés

### 🧠 Intelligence Artificielle Avancée

- **Google Gemini 3 Pro Vision** : Utilisation du dernier modèle multimodal pour une compréhension visuelle parfaite.
- **Contexte Multiple** : Téléchargez des images d'inspiration, des visages ou des éléments de contexte pour guider l'IA.
- **Rendu Parallèle** : Générez jusqu'à 4 miniatures simultanément pour un gain de temps maximal.

### 🍱 Expérience Utilisateur Premium

- **Interface style Vercel** : Un design propre, minimaliste et réactif (Dark/Light mode).
- **Gestion des Ratios** :
  - **16:9** (Standard YouTube)
  - **9:16** (YouTube Shorts / TikTok)
  - **1:1** (Post Communauté)
- **Historique Local** : Retrouvez vos dernières créations dans un modal dédié (sauvegardées via LocalStorage).
- **Régénération Individuelle** : Un résultat ne vous plaît pas ? Régénérez uniquement cette image.

### 🛠️ Outils de Productivité

- **Export ZIP** : Téléchargez l'ensemble de vos créations en un seul fichier compressé.
- **Mode Démo** : Testez l'interface sans consommer votre quota API grâce à la simulation d'images.
- **Suggestions Intelligentes** : Des prompts pré-configurés pour booster votre créativité.

---

## 🛠️ Installation & Configuration

### Pré-requis

- **Node.js 18+**
- **pnpm** (recommandé)
- Une clé API Google AI Studio ([Obtenir ici](https://aistudio.google.com/))

### Étapes

1. **Cloner le projet**

   ```bash
   git clone https://github.com/enockmigjr/thumbnail-gen.git
   cd thumbnail-gen
   ```

2. **Installer les dépendances**

   ```bash
   pnpm install
   ```

3. **Variables d'environnement**
   Créez un fichier `.env.local` à la racine :

   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=votre_cle_api_ici
   ```

4. **Lancer le serveur de développement**
   ```bash
   pnpm dev
   ```

---

## 🏗️ Architecture du Projet

```text
src/
├── app/               # Routes Next.js & API
│   └── api/generate   # Logique backend (Gemini API)
├── components/        # Composants UI React
│   ├── ui/            # Composants de base (Shadcn)
│   ├── HistoryModal   # Gestion de l'historique
│   ├── DropZone       # Upload glisser-déposer
│   └── ThumbnailGrid  # Affichage des résultats
├── lib/               # Utilitaires (cn, etc.)
└── styles/            # Configuration CSS
```

---

## 🎯 Feuille de Route (Prochaines Étapes)

- [ ] **Éditeur de texte** : Ajout de titres par-dessus les images.
- [ ] **Suppression de fond** : Extraction automatique du sujet principal.
- [ ] **Previews Réelles** : Simulation d'affichage sur l'interface YouTube.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une _Issue_ ou à soumettre une _Pull Request_.

## 📄 Licence

Ce projet est sous licence MIT. Fait avec ❤️ par [Enock Junior MIGNANWANDE](https://github.com/enockmigjr).
