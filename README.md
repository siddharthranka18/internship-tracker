# Internship Tracker – Full Stack Web Application
A full-stack web application to track internship applications in one place, allowing users to add, update, and manage application statuses efficiently.
## 🚀 Features
Add, edit, and delete internship applications
Track application status (Applied, Interview, Rejected, Offer)
Sort applications by deadline
Responsive UI (works on desktop and mobile)
Instant UI updates using React state management
## 🛠 Tech Stack
### Frontend
- React
- JavaScript
- HTML, CSS
### Backend
- Node.js
- Express.js
- REST APIs
### Database
- MongoDB
### Tools & Deployment
- Git & GitHub
- Vercel (Frontend)
- Render (Backend)
## 🏗 Project Structure
internship-tracker/
│── frontend/    # React frontend
│── backend/     # Node.js + Express backend
│── README.md
## ⚙️ API Overview
GET /api/internships – Fetch all internship applications
POST /api/internships – Add a new application
PUT /api/internships/:id – Update an application
DELETE /api/internships/:id – Delete an application
### 3️⃣Run Locally
### Backend
bash
cd backend
npm install
npm run dev
### frontend 
cd frontend
npm install
npm start
🔗 Live Demo  
Frontend:https://internship-tracker-one.vercel.app/
Backend API:https://intern-track-backend-new.onrender.com/