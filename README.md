# LiveDocs

LiveDocs is a real-time collaborative document editor inspired by Google Docs. Built with Next.js and TypeScript, the application allows multiple users to create, edit, share, and collaborate on documents simultaneously.

The project focuses on implementing real-time collaboration, document management, user interactions, and a modern responsive interface using **Liveblocks**, **Lexical Editor**, and **Tailwind CSS**.

## ✨ Features

* **Authentication** — Secure user authentication and session management.
* **Collaborative Text Editor** — Multiple users can edit the same document simultaneously with real-time updates.
* **Document Management**

  * Create and edit documents
  * Automatically save document changes
  * Delete documents
  * Search and sort documents
  * View documents owned by or shared with the user
* **Document Sharing** — Share documents with other users and control their access.
* **Comments** — Add comments to documents and collaborate through discussions.
* **Real-time Presence** — See active collaborators while editing a document.
* **Notifications** — Receive notifications about document sharing, comments, and collaboration activity.
* **Responsive Design** — Optimized for different screen sizes and devices.

## ⚙️ Tech Stack

* **Next.js**
* **TypeScript**
* **React**
* **Liveblocks**
* **Lexical Editor**
* **Tailwind CSS**
* **ShadCN UI**
* **Zod**
* **React Hook Form**

## 🧩 Real-time Collaboration

One of the main goals of LiveDocs is to demonstrate how real-time collaboration can be implemented in a modern frontend application.

**Liveblocks** is used to synchronize document changes and user presence between multiple clients, allowing users to work on the same document simultaneously.

The editor is powered by **Lexical**, providing a rich and extensible editing experience.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* npm, pnpm, or another package manager

### Clone the repository

```bash
git clone https://github.com/your-username/codocs.git
cd codocs
```

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory and add the required environment variables:

```env
# Authentication
...

# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=

# API
...
```

Add your own credentials and configuration values to the corresponding variables.

### Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📌 Project Purpose

LiveDocs was created as a practical frontend project to explore real-time application architecture and collaborative user experiences.

The project demonstrates working with modern React and Next.js patterns, real-time data synchronization, rich text editing, authentication, form handling, reusable UI components, and responsive design.
