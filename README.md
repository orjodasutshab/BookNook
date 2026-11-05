<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&height=260&color=gradient&customColorList=12,20,24,30&text=BookNook&fontSize=84&fontColor=ffffff&fontAlignY=42&stroke=ffffff&strokeWidth=2&desc=Add%20a%20book.%20Borrow%20a%20book.%20Return%20a%20book.&descSize=22&descAlignY=66&animation=twinkling" alt="BookNook banner" width="100%" />

<a href="https://github.com/orjodasutshab/BookNook">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1200&color=7C3AED&center=true&vCenter=true&width=640&lines=A+small+online+library+for+everyone;Borrow+books+for+a+few+days;Track+every+book+you+borrowed;Built+with+Next.js%2C+BetterAuth+and+MongoDB" alt="Typing animation" />
</a>

<br/>

### 🌐 Live Site: [https://booknook-silk.vercel.app](https://booknook-silk.vercel.app)

<br/>

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![DaisyUI](https://img.shields.io/badge/DaisyUI-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 📖 About The Project

**BookNook** is a small online library. Users can browse every book, add new books, borrow a book for a few days, and return it when they are done.

> **Simple idea: Add a book, borrow a book, return a book.**

Every book keeps a live count of available copies, so a book that is fully borrowed shows **Not Available** until somebody returns it.

---

## ✨ Key Features

- 🎠 **Swiper.js hero slider** with three slides, each with a title, a short line and a **Browse Books** button.
- 🆕 **New Arrivals** that load the six newest books straight from MongoDB (sorted newest first).
- 🔐 **Secure authentication** with BetterAuth and the MongoDB adapter: email and password sign up, plus **Google login**.
- ✅ **Password rules**: at least 6 characters, one uppercase and one lowercase letter, with clear error messages.
- 🧭 **Private routes** (Add Book, My Books, My Borrows, Book Details). A logged-in user stays logged in after a reload, and a visitor is sent back to the page they wanted after login.
- 📚 **Full book CRUD**: add a book with an image upload (imgbb), edit it with a pre-filled form, and delete it after a custom confirm modal.
- 🔁 **Smart borrow system**: borrow with a return date, available copies change with `$inc`, and **no double borrow** of the same book.
- 🛡️ **JWT protected API** so only logged-in users can change data.
- 🌗 **Dark and light theme** switch in the navbar.
- 🎬 **Framer Motion** animations on cards and sections.
- 🔔 **Toast messages** for every success and error (no browser alerts).
- 📱 **Fully responsive** for mobile, tablet and desktop, with a custom **404 page** and a different page title on every route.

---

## 🗺️ Pages and Routes

| Route | Access | What it does |
|---|---|---|
| `/` | Public | Slider, New Arrivals and extra sections |
| `/books` | Public | All books in an equal-size card grid |
| `/books/:id` | Private | Full book details and the **Borrow This Book** modal |
| `/add-book` | Private | Add a new book with image upload |
| `/my-books` | Private | Edit and delete the books you added |
| `/my-borrows` | Private | See your borrowed books and return them |
| `/profile` | Private | View and edit your profile |
| `/login` | Public | Email and Google login |
| `/register` | Public | Create a new account |
| `*` | Public | Custom 404 page with a **Back to Home** button |

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS, DaisyUI |
| Auth | BetterAuth, MongoDB adapter, JWT |
| Slider and motion | Swiper.js, Framer Motion |
| Notifications | React Hot Toast |
| Image hosting | imgbb |
| Database | MongoDB |
| Hosting | Vercel |

🔗 **Server repository:** [orjodasutshab/booknook-server](https://github.com/orjodasutshab/booknook-server)

---

## 📂 Project Structure

```
BookNook
├── app
│   ├── page.tsx              # Home
│   ├── books/                # All Books and Book Details
│   ├── add-book/             # Add Book (private)
│   ├── my-books/             # My Books (private)
│   ├── my-borrows/           # My Borrows (private)
│   ├── profile/              # Profile (private)
│   ├── login/  register/     # Authentication pages
│   ├── api/auth/             # BetterAuth route handler
│   └── not-found.tsx         # Custom 404
├── components                # Navbar, Footer, Hero, BookCard, BookForm, Avatar...
├── lib                       # api.ts, auth.ts, auth-client.ts
└── middleware.ts             # Private route protection
```

---

## 🚀 Getting Started

**1. Clone the repository**

```bash
git clone https://github.com/orjodasutshab/BookNook.git
cd BookNook
```

**2. Install packages**

```bash
npm install
```

**3. Create a `.env.local` file** (copy from `.env.example`) and fill in the values:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/booknook
DB_NAME=booknook
BETTER_AUTH_SECRET=a-long-random-string
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**4. Run the app**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Make sure the [BookNook server](https://github.com/orjodasutshab/booknook-server) is running on port `5000`.

---

<div align="center">

### 👨‍💻 Made by **Orjo Das Utshab**

[![GitHub](https://img.shields.io/badge/GitHub-orjodasutshab-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/orjodasutshab)

⭐ If you like this project, give it a star!

<img src="https://capsule-render.vercel.app/api?type=waving&height=120&color=gradient&customColorList=12,20,24,30&section=footer" width="100%" alt="footer" />

</div>
