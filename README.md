# 🎵 Full Stack Music Player

A modern **Full Stack Music Player Web Application** that allows users to discover, stream, like, and manage songs with a smooth and responsive interface.

This project demonstrates a complete **full-stack architecture using React for the frontend and Node.js/Express for the backend**, with modular code structure and state management using Redux.

---

# 🚀 Tech Stack

## Frontend

* React (Vite)
* Redux Toolkit
* React Router
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* ImageKit (Media Storage)

---

# ✨ Features

## 🔐 User Authentication

* User Signup
* Secure Login System
* Password Reset
* Profile Editing

## 🎧 Music Player

* Play / Pause songs
* Song playlist
* Song details view
* Audio player controls
* ❤️ Like / Favorite songs

## 🎨 UI Features

* Fully responsive design
* Sidebar navigation
* Song search functionality
* Modal components
* Clean modern UI

---

# 📂 Project Structure

```
Music-Player
│
├── BackEnd
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── utils
│
└── FrontEnd
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── redux
    │   ├── hooks
    │   └── css
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone the Repository

```
git clone https://github.com/venkataprabhath15/Music-Player-App.git
cd Music-Player-App
```

---

## 2️⃣ Backend Setup

```
cd BackEnd
npm install
npm start
```

---

## 3️⃣ Frontend Setup

Open another terminal:

```
cd FrontEnd
npm install
npm run dev
```

---

# 🔐 Environment Variables

Create a `.env` file inside the **BackEnd** folder.

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_url
```

⚠️ **Important:**
Never upload `.env` files to GitHub. Add `.env` to `.gitignore`.

---

# 🎯 Future Improvements

* Music recommendation system
* Playlist sharing
* Dark / Light mode
* Song comments
* Mobile app version

---

# 👨‍💻 Author

**Venkata Prabhath Thatavarti**

ICT Student | Aspiring AI & Full Stack Developer
Passionate about **Full Stack Development, AI, and Problem Solving**
