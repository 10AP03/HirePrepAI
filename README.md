# 🚀 HirePrep AI V2
### AI-Powered Interview Preparation & Candidate Assessment Platform

HirePrep AI is a full-stack AI-powered platform designed to help students prepare for technical interviews and assist recruiters in evaluating candidates efficiently. The platform leverages AI to analyze resumes, conduct mock interviews, generate personalized feedback, and provide candidate performance analytics.

---

## ✨ Features

### 👨‍🎓 Candidate Portal
- Secure JWT Authentication
- Resume Upload & Management
- AI-Powered Resume Analysis
- ATS Score Generation
- AI Mock Interview
- Personalized Interview Feedback
- Skill Dashboard
- Interview History
- Performance Analytics

### 👨‍💼 Recruiter Portal
- Secure Recruiter Login
- Candidate Management
- Candidate Profiles
- Interview Performance Dashboard
- Resume & Skill Insights

### 🤖 AI Features
- Resume Parsing
- ATS Score Evaluation
- Technical Skill Extraction
- Personalized Resume Feedback
- AI-Based Interview Evaluation

---

# 🛠️ Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Multer
- PDF Parse
- Groq AI SDK

### Database
- MongoDB Atlas

---

# 📂 Project Structure

```
HirePrepAI/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
└── hireprep-ai-frontend/
    ├── src/
    ├── public/
    └── vite.config.js
```

---

# 🔐 Authentication

- JWT-Based Authentication
- Role-Based Access Control
- Protected Routes
- Secure Password Hashing using bcrypt

---

# 🧠 AI Workflow

```
Resume Upload
      │
      ▼
PDF Parsing
      │
      ▼
Groq AI Analysis
      │
      ▼
ATS Score
      │
      ▼
Skill Extraction
      │
      ▼
Candidate Dashboard
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/HirePrepAI.git
cd HirePrepAI
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

## Frontend Setup

```bash
cd hireprep-ai-frontend
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

---

# 📈 Future Scope

- Adaptive AI Interviews
- Skill Confidence Scoring
- Resume Claim Verification
- AI Career Mentor
- Company-Specific Interview Preparation
- Enterprise Recruiter Dashboard

---

# 👨‍💻 Developer

**Arth Patel**

- GitHub: https://github.com/10AP03
- LinkedIn: https://linkedin.com/in/arth-patel-465134329

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
