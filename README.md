# 🎯 AI Interview Prep Platform

**Master Your Interview Skills** - Practice coding challenges and mock AI interviews to ace your placement season.

![Platform Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🚀 What is This?

A comprehensive self-practice platform designed for students and professionals preparing for technical interviews. Combine LeetCode-style coding challenges with AI-powered mock interviews to build confidence and improve your skills.

## ✨ Features

### 🎤 AI Mock Interviews
- **Real-time AI interviewer** with speech recognition and synthesis
- **Personalized questions** based on your experience level
- **Instant feedback** on communication, technical knowledge, and soft skills
- **Score breakdown** across multiple dimensions (Technical, Soft Skills, Clarity, Problem Solving)

### 💻 Coding Challenges
- **Curated problem set** covering Arrays, Strings, Dynamic Programming, and more
- **Live code execution** with multiple test cases
- **Difficulty levels** from Easy to Hard
- **Real-time feedback** on code correctness

### 📊 Progress Tracking
- **Session history** with detailed performance metrics
- **Improvement trends** showing your growth over time
- **Practice streaks** to keep you motivated
- **Average score tracking** across all sessions

### 🎨 Modern UI/UX
- **Dark mode** support for comfortable practice sessions
- **Responsive design** works on desktop and tablet
- **Real-time video feed** during interviews
- **Smooth animations** and intuitive navigation

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- TailwindCSS for styling
- Recharts for data visualization
- Web Speech API for voice interaction
- Axios for API calls

**Backend:**
- Node.js + Express
- MongoDB for data persistence
- JWT authentication
- Local code execution engine

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or Atlas)

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ai-interview-platform
```

2. **Install dependencies**
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Configure environment variables**

Create `server/.env`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. **Seed the database** (optional)
```bash
cd server
node scripts/seed_problems.js
```

5. **Start the application**

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

6. **Access the platform**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## 📖 Usage

1. **Register/Login** to create your account
2. **Browse challenges** on the Practice Dashboard
3. **Start a mock interview** to practice soft skills and technical questions
4. **Solve coding problems** with instant feedback
5. **Track your progress** and see your improvement over time

## 🎯 Roadmap

- [ ] Add more coding problems (100+ problems)
- [ ] Implement hints and solutions for learning
- [ ] Add company-specific interview prep tracks
- [ ] Peer comparison and leaderboards
- [ ] Mobile app support
- [ ] Video recording of practice sessions

## 📄 License

MIT License - feel free to use this for your own interview prep!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 💡 Tips for Best Results

- **Practice regularly** - Consistency is key to improvement
- **Review your sessions** - Watch your progress stats and identify weak areas
- **Speak clearly** - The AI interviewer works best with clear speech
- **Challenge yourself** - Gradually increase difficulty as you improve

---

**Built with ❤️ for students preparing for their dream jobs**
