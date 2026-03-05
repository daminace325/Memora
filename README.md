<div align="center">

# ✨ Memora

**Connect, Share, and Remember the Moments that Matter.**

A modern, full-stack social media application built with Next.js — featuring photo sharing, stories, user profiles, real-time interactions, and more.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-memora--ten.vercel.app-blue?style=for-the-badge&logo=vercel)](https://memora-ten.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## 📸 Overview

Memora is an Instagram-inspired social platform where users can share photos, post ephemeral stories, follow friends, and engage through likes, comments, and bookmarks. Built with modern web technologies, it delivers a fast, responsive, and visually polished experience on both desktop and mobile.

---

## 🚀 Features

### Core
- **Photo Sharing** — Upload and share images with descriptions
- **Stories** — Post ephemeral stories that auto-expire after 24 hours
- **News Feed** — Personalized home feed showing posts from followed users
- **Browse** — Discover new content in a masonry-grid layout

### Social
- **Likes & Comments** — Engage with posts through likes and threaded comments
- **Bookmarks** — Save posts for later viewing
- **Follow System** — Follow/unfollow users to curate your feed
- **User Profiles** — Customizable profiles with avatar, bio, subtitle, and username
- **User Search** — Find other users by name or username

### Technical
- **Google OAuth** — Secure authentication via NextAuth.js v5
- **Image Uploads** — Decentralized file storage powered by Pinata (IPFS)
- **Server Actions** — Type-safe mutations with Zod validation
- **Intercepting Routes & Modals** — View posts and stories in elegant modals without leaving the feed
- **Responsive Design** — Adaptive layout with dedicated mobile and desktop navigation
- **Turbopack** — Lightning-fast development builds

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + [Radix UI Themes](https://www.radix-ui.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) via [Prisma ORM 6](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/) (Google provider) |
| **File Storage** | [Pinata](https://www.pinata.cloud/) (IPFS) |
| **Validation** | [Zod](https://zod.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📁 Project Structure

```
src/
├── app/
│   └── (routes)/
│       ├── page.tsx              # Home / landing page
│       ├── layout.tsx            # Root layout with nav
│       ├── @modal/               # Intercepting route modals
│       │   ├── (.)posts/[id]/    # Post modal
│       │   └── (.)stories/[id]/  # Story modal
│       ├── browse/               # Discover content
│       ├── create/               # Create a new post
│       ├── create-story/         # Create a new story
│       ├── posts/[id]/           # Full post page
│       ├── stories/[id]/         # Full story page
│       ├── profile/              # Current user profile
│       │   ├── bookmarked/       # Bookmarked posts
│       │   └── highlights/       # Story highlights
│       ├── search/               # User search
│       ├── settings/             # Profile settings & logout
│       ├── users/[username]/     # Public user profiles
│       └── api/
│           ├── auth/[...nextauth]/ # Auth endpoints
│           └── upload/             # Image upload endpoint
├── components/                   # Reusable UI components
├── lib/                          # Utility functions
├── actions.ts                    # Server actions (CRUD)
├── auth.ts                       # NextAuth configuration
├── config.ts                     # Pinata SDK setup
├── db.ts                         # Prisma client
└── proxy.ts                      # Proxy utilities
prisma/
└── schema.prisma                 # Database schema
```

---

## ⚡ Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** (or yarn/pnpm)
- A **MongoDB** database (e.g., [MongoDB Atlas](https://www.mongodb.com/atlas))
- A **Google Cloud** project with OAuth 2.0 credentials
- A **Pinata** account for IPFS file storage

### 1. Clone the repository

```bash
git clone https://github.com/your-username/memora.git
cd memora
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>"

# NextAuth
AUTH_SECRET="your-random-secret-string"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Pinata (IPFS)
PINATA_JWT="your-pinata-jwt"
NEXT_PUBLIC_PINATA_GATEWAY_URL="your-pinata-gateway-url"
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Push database schema

```bash
npx prisma db push
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🗄 Database Schema

The app uses **MongoDB** with **Prisma ORM**. Key models:

- **Profile** — User profile (email, username, name, avatar, bio, subtitle)
- **Post** — Image posts with description and like count
- **Comment** — Comments on posts
- **Like** — Post likes (unique per user per post)
- **Bookmark** — Saved posts (unique per user per post)
- **Follower** — Follow relationships between profiles
- **Story** — Ephemeral stories with 24-hour expiration

---

## 🌐 Deployment

The app is deployed on **Vercel** and accessible at:

🔗 **[https://memora-ten.vercel.app](https://memora-ten.vercel.app/)**

To deploy your own instance:

1. Push the repo to GitHub
2. Import the project on [Vercel](https://vercel.com/new)
3. Add all environment variables in the Vercel dashboard
4. Deploy — Vercel handles the rest automatically

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ using Next.js, TypeScript, and MongoDB</sub>
</div>
