# 🚀 ThumbnailAI Studio - Générateur de Miniatures YouTube Ultra-Rénaliste

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google-Gemini_3_Pro-4285F4?style=flat-square&logo=google-gemini)](https://ai.google.dev/)

**ThumbnailAI** est une application web ultra-performante conçue pour les créateurs de contenu souhaitant générer des miniatures percutantes en quelques secondes grâce à l'intelligence artificielle de Google Gemini.Elle ne se contente pas de générer des images ; elle analyse, compare et simule vos miniatures pour maximiser votre taux de clic (CTR).

Domaines
- thumbnail-gen-vert.vercel.app
- thumbnail-gen-git-master-enockmigjrs-projects.vercel.app
- thumbnail-5jaccwatd-enockmigjrs-projects.vercel.app
---

## 🔥 Nouveautés Studio v1.2

### ⚔️ IA CTR Predictor (A/B Testing Vision)

- **Analyse Comparative** : Sélectionnez deux miniatures et laissez l'IA simuler le comportement humain.
- **Rapport Détallé** : Obtenez une analyse sur la psychologie des couleurs, la composition et l'impact émotionnel.
- **Verdict de conversion** : L'IA désigne mathématiquement la version la plus susceptible de faire cliquer.

- **Nouveau Player** : Simulation fidèle de l'interface YouTube 2026.
- **Grille de Flux** : Visualisez votre miniature au milieu de véritables contenus factices pour tester le contraste.
- **Multi-Supports** : Basculez entre le mode **Desktop** (avec barre latérale) et le mode **Mobile** pour une vérification parfaite.

### ✍️ Générateur de Titres IA

- **Analyse Visuelle** : L'IA regarde votre image et propose 5 titres optimisés.
- **Copie Rapide** : Cliquez sur un titre pour le copier ou l'injecter directement dans le simulateur YouTube.

---

## ✨ Fonctionnalités de Base

- **Google Gemini 3 Pro Vision** : Modèle multimodal de pointe.
- **Upload Multimodal** : Incorporez vos propres visages, logos ou styles d'inspiration.
- **Ratios Flexibles** : Support du 16:9, 9:16 (Shorts) et 1:1.
- **Historique Local** : Sauvegarde automatique de vos sessions pour ne rien perdre.
- **Export ZIP** : Téléchargement massif de vos variantes en un clic.

---

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
   GOOGLE_GENERATIVE_AI_API_KEY=votre_cle_gemini
   ```

4. **Lancer le serveur de développement**
   ```bash
   pnpm dev
   ```

---

## 🛠️ Architecture

- **Framwork** : Next.js 15 (App Router)
- **IA SDK** : Vercel AI SDK + Google Generative AI
- **UI** : Tailwind CSS 4 + Shadcn UI + Lucide Icons
- **Simulation** : System de portails React pour une immersion totale sans polluer le DOM principal.

---

## 🎯 Roadmap

- [ ] **Éditeur de texte** : Ajout de titres par-dessus les images.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une _Issue_ ou à soumettre une _Pull Request_.

## 📄 Licence

Ce projet est sous licence MIT. Fait avec ❤️ par [Enock Junior MIGNANWANDE](https://github.com/enockmigjr).
