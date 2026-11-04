# BookNook

**Live site:** https://your-booknook.vercel.app  (deploy korar por URL ta ekhane boshao)

BookNook is a small online library. Add a book, borrow a book, return a book.

## Features
- Home page with a Swiper.js slider, 6 newest books from MongoDB and two extra sections
- Email/password and Google login with BetterAuth, password rules (uppercase, lowercase, 6+ chars)
- Private routes that keep you logged in after reload and send you back after login
- Full book CRUD with imgbb image upload, edit form and a custom delete confirm modal
- Borrow system with return date, available copies (`$inc`) and no double borrow
- JWT protected Express API, dark/light theme, Framer Motion animations and a custom 404 page

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill the values
3. `npm run dev`
