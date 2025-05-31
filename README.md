

# ✍️ Vrite – Collaborative Text Editor

**Vrite** is a modern full-stack collaborative text editor built with **Next.js**, powered by **Tiptap**, **Liveblocks**, **Convex**, and **Clerk**. Designed for real-time collaboration, authentication, and cloud persistence — Vrite brings seamless team writing and editing to the web.


---

## 🚀 Features

- 🔐 **Authentication** – Secure user auth via [Clerk](https://clerk.dev/)
- 📝 **Rich Text Editing** – Feature-rich editor powered by [Tiptap](https://tiptap.dev/)
- 🤝 **Real-Time Collaboration** – Live cursors and editing using [Liveblocks](https://liveblocks.io/)
- ☁️ **Serverless Backend** – Blazing fast & reactive storage with [Convex](https://www.convex.dev/)
- ⚡ **Full-stack Next.js App** – Built with App Router and modern best practices
- 📂 **Multiple Documents** – Create, edit, and organize documents per user
- 💾 **Auto-save** – Persist document changes instantly in the cloud

---

## 🛠️ Tech Stack

| Layer         | Technology          |
|---------------|---------------------|
| Frontend      | Next.js, Tailwind CSS, Tiptap |
| Auth          | Clerk               |
| Real-time     | Liveblocks          |
| Backend (DB)  | Convex              |
| State Sync    | Liveblocks + Convex |
| Hosting       | Vercel (Frontend), Convex Cloud (Backend) |

---

## 📸 Demo

[Live Demo](https://vrite-docs.vercel.app) <!-- Replace with actual link -->

---

## 📦 Installation

```bash
git clone https://github.com/txbish/vrite.git
cd vrite
pnpm install  # or yarn / npm install
````

### 🔐 Setup Environment Variables

Create a `.env.local` file in the root and add the following:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key

CONVEX_DEPLOYMENT=your_convex_deployment_url
CONVEX_ADMIN_KEY=your_convex_admin_key
```

---

## 🚴‍♂️ Running Locally

```bash
pnpm dev
# or
npm run dev
```

---

## 🧪 Folder Structure

```
/app           - Next.js App Router
/components    - Reusable UI components
/lib           - Utilities and Convex/Clerk clients
/hooks         - Custom React hooks
/editor        - Tiptap configuration
/convex        - Convex backend functions (mutation/query)
```

---

## ✨ Contributions

Contributions, issues and feature requests are welcome!
Feel free to [open an issue](https://github.com/your-username/vrite/issues) or submit a PR.

---

## 📄 License

Licensed under the [MIT License](LICENSE).

---

## 🤝 Acknowledgements

* [Tiptap](https://tiptap.dev/) – Headless rich-text editor
* [Liveblocks](https://liveblocks.io/) – Multiplayer infrastructure
* [Convex](https://convex.dev/) – Reactive backend
* [Clerk](https://clerk.dev/) – Authentication and user management
* [Next.js](https://nextjs.org/) – React framework for production

---

> Built with ❤️ by Tabish Noman Khan
