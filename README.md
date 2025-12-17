# 📬 Chat App – Frontend

A modern, responsive, and real-time chat application built with **Next.js 15**, **React 19**, and **Tailwind CSS**. Designed for seamless messaging with support for emojis, rich links, dark mode, and internationalization.

---

## ✨ Features

- **Real-time messaging** via Socket.IO
- **Responsive UI** for mobile & desktop
- **Dark/light mode** with `next-themes`
- **Emoji picker** integration (`emoji-picker-react`)
- **Auto-link detection** in messages (`linkifyjs` + `linkify-react`)
- **Form validation** with `react-hook-form` + `zod`
- **Global state management** using `zustand`
- **Animations & transitions** powered by `motion` (Framer Motion)
- **Internationalization (i18n)** with `next-intl`
- **RTL support** detection (`rtl-detect`)
- **Reusable UI components** built with Shadcn/ui + Radix UI + Tailwind
- **Toast notifications** via `sonner`
- **Lottie animations** for enhanced UX

---

## 🛠️ Tech Stack

| Layer      | Technologies                                                       |
| ---------- | ------------------------------------------------------------------ |
| Framework  | Next.js 15 (App Router) + Turbopack (dev)                          |
| UI         | React 19, Tailwind CSS v4, Radix UI, Lucide React, React Icons     |
| Styling    | Tailwind CSS, `clsx`, `tailwind-merge`, `class-variance-authority` |
| State      | Zustand                                                            |
| Forms      | React Hook Form + Zod + `@hookform/resolvers`                      |
| Realtime   | `socket.io-client`                                                 |
| Animations | Framer Motion (`motion`), Lottie React, `tw-animate-css`           |
| i18n & UX  | `next-intl`, `next-themes`, `rtl-detect`                           |
| Utils      | `immer`, `@uidotdev/usehooks`                                      |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ v18
- npm or pnpm (this project uses npm by default)

### Installation

```bash
# Clone the repo (if not already)
git clone https://github.com/your-username/chat-app-front.git
cd chat-app-front

# Install dependencies
npm install
```

### Environment Variables

Create a .env.local file in the root directory:

```bash
NEXT_PUBLIC_BASE_URL=https://localhost:5000/api
```

To download backend also
[Chat-App Backend](https://github.com/mohamed-helmy22020/chat-back)

### Development

Run this command

```bash
npm run dev
```

Runs the app in development mode with Turbopack and HTTPS support.
Open https://localhost:3000 in your browser.

### Build & Production

```bash
# Build the app
npm run build

# Start the production server
npm run start
```

## 🌍Internationalization

Translations are managed via `next-intl`. Add new languages under the `messages/` directory.
Example:

```bash
/messages
  ├── en.json
  └── ar.json
```

RTL languages (like Arabic) are auto-detected and handled via `rtl-detect`.

## 🧩 UI Components

Built with Shadcn/ui on top of Radix UI Primitives for accessibility and Tailwind for styling.
Common patterns:

- Context menus, tooltips, dialogs
- Custom select & dropdowns
- Animated transitions with `motion`

## 📄 License

ISC License

---

Made with ❤️ and ☕
