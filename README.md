# AccessibleVote 🗳️

## Problem Statement

**P.S 10:** Ensuring Equal Electoral Participation for Specially Abled Individuals

## Project Name

**Project Name:** AccessibleVote

## Team Name

**Team Name:** VIBER

## Members

1. Pawan Kumar
2. Prashant Soni
3. Ritik Soni
4. Priyanshu

## Deployed Link (optional)

deployed app link : https://vote-1-2pap.onrender.com/

## 2-minute Demonstration Video link

Add a 2-minute demo video link (YouTube/Drive):

## PPT Link

Project presentation (PPT) link: https://docs.google.com/presentation/d/1TrHVeZOIcqc9sij1QVUr9S3KXAbrX08p/edit?usp=sharing&ouid=106870957439834119286&rtpof=true&sd=true

---

## Project Overview

AccessibleVote is an accessibility-first voting assistance platform designed to enable specially abled individuals to participate in elections independently, securely, and with dignity. The system focuses on inclusive interface design by supporting voice guidance, keyboard-only navigation, screen-reader compatibility, high-contrast visuals, and privacy-preserving interactions. Built as a demonstrative prototype rather than a real election system, AccessibleVote highlights how thoughtful accessibility and assistive technologies can remove participation barriers, reduce dependence on third parties, and promote equal, barrier-free democratic participation for all voters.

### Key Features

- ✅ Secure user registration with email & phone verification (OTP)
- ✅ Voice-activated voting commands using Web Speech API
- ✅ Speech synthesis for reading candidates and confirmation
- ✅ High-contrast mode for visual accessibility
- ✅ Adjustable font size (80%-150%) for better readability
- ✅ **Full keyboard navigation** with skip links and focus management
- ✅ **Keyboard shortcuts** for quick navigation (Alt+H, Alt+C, Alt+P, etc.)
- ✅ **Focus traps** in modals for better keyboard navigation
- ✅ Screen reader compatible with comprehensive ARIA labels
- ✅ **Escape key support** to close dialogs and modals
- ✅ Real-time election calendar
- ✅ Complete voting history tracking
- ✅ Responsive design for all devices

---

## Tech Stack

- **Frontend:** React, Material-UI, Vite, Axios, Sass/SCSS
- **Backend:** Node.js, Express.js, JWT Authentication
- **Database:** MongoDB, Mongoose ODM
- **Additional Libraries:** bcrypt (password hashing), nodemailer (email), Vonage SDK (SMS), Web Speech API
- **Features:** Voice commands, speech synthesis, high-contrast mode, ARIA accessibility

---

## Folder Structure

```
GFGBQ-Team-viber/
│
├── backend/                      # Backend server
│   ├── src/
│   │   ├── controllers/          # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── candidateController.js
│   │   │   ├── electionController.js
│   │   │   └── voteController.js
│   │   ├── models/               # Database schemas
│   │   │   ├── userModel.js
│   │   │   ├── electionModel.js
│   │   │   ├── candidateModel.js
│   │   │   └── voteModel.js
│   │   ├── routes/               # API routes
│   │   │   └── routes.js
│   │   ├── app.js                # Express app
│   │   └── config.js
│   ├── .env                      # Environment variables
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── frontend/                     # React frontend
│   ├── public/
│   │   └── img/                  # Images & assets
│   ├── src/
│   │   ├── components/
│   │   │   └── navBar/
│   │   │       ├── NavBar.jsx
│   │   │       └── navBar.scss
│   │   ├── pages/                # All page components
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── electionDetails/  # Voting page with voice features
│   │   │   ├── electionCalendar/
│   │   │   ├── electionResult/
│   │   │   ├── myVotesHistory/
│   │   │   ├── profile/
│   │   │   ├── securityInformation/
│   │   │   ├── validateLogin/
│   │   │   └── verifyEmailPhone/
│   │   ├── utils/
│   │   │   └── speech.js         # Web Speech API utilities
│   │   ├── App.jsx
│   │   ├── AuthContext.jsx
│   │   ├── config.js
│   │   ├── index.jsx
│   │   └── highContrast.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.mjs
│
├── .gitignore
└── README.md
```

---

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or cloud instance)
- Git

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ByteQuest-2025/GFGBQ-Team-viber.git
   cd GFGBQ-Team-viber
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/votingSystem
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   VONAGE_API_KEY=your-vonage-key
   VONAGE_API_SECRET=your-vonage-secret
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Database:**
   - Install and start MongoDB locally, or
   - Use a cloud MongoDB service and update the connection string in `.env`

### Running the Application

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## Usage Instructions

### Starting the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
   The backend will start on port 5000 (or next available port if 5000 is busy).

2. **Start the Frontend Server:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (Vite dev server).

3. **Database Setup:**
   - Ensure MongoDB is running locally on port 27017
   - Or set `MONGODB_URI` in `backend/.env` for a different MongoDB instance

### User Guide

#### For Voters (Specially Abled Individuals)

1. **Registration:**
   - Navigate to the registration page
   - Fill in required details (first name, last name, email, phone)
   - Verify email and phone through OTP
   - Use voice guidance or screen reader for assistance

2. **Login:**
   - Enter email/phone and password
   - Use keyboard navigation (Tab, Enter, Space)
   - Voice prompts guide through the process

3. **Voting Process:**
   - Browse available elections on the calendar
   - Select an election to view details
   - **Voice Commands:** Click the 🎤 microphone icon and say "Vote for [Candidate Name]"
   - **Read Aloud:** Click the 🔊 speaker icon to hear all candidates
   - Choose your candidate from the list
   - Confirm your vote by typing the candidate's name
   - Receive confirmation with voice feedback

4. **View Vote History:**
   - Access "My Votes History" page
   - Review past voting activity

#### Accessibility Features

- **Screen Reader Support:** All elements have proper ARIA labels
- **Keyboard Navigation:** Full keyboard-only operation
- **High Contrast Mode:** Toggle switch in navigation bar for improved visibility
- **Font Size Control:** Increase/decrease text size (80%-150%) using navbar buttons
- **Voice Guidance:** Audio prompts for navigation and actions
- **Voice Commands:** "Vote for [Candidate Name]" to cast vote
- **Speech Synthesis:** Automatic reading of candidate details and confirmations
- **Large Text Options:** Scalable interface elements

#### For Administrators

1. **Create Elections:**
   - POST `/api/elections` with election details (title, description, dates)

2. **Manage Candidates:**
   - Add candidates to elections via API
   - Update or remove candidates as needed

3. **Monitor Results:**
   - GET `/api/elections/:id/results` for election outcomes

---

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/verify` - Email/phone verification
- `POST /api/login` - User login
- `POST /api/validate-login` - 2FA validation

### Elections
- `POST /api/elections` - Create election
- `GET /api/elections` - List all elections
- `GET /api/election/:id` - Get election details
- `PUT /api/elections/:id` - Update election
- `DELETE /api/elections/:id` - Delete election
- `GET /api/elections/:id/results` - Get election results

### Candidates
- `POST /api/candidates/:electionId` - Add candidate to election
- `GET /api/candidate/:id` - Get candidate details
- `GET /api/candidates/:electionId` - List candidates for election
- `PUT /api/candidates/:electionId/:candidateId` - Update candidate
- `DELETE /api/candidates/:electionId/:candidateId` - Remove candidate

### Voting
- `POST /api/votes` - Cast a vote
- `GET /api/my-votes` - Get user's vote history

---

## Voice Features (Web Speech API)

### Speech Recognition
- Click the microphone icon on the election details page
- Say "Vote for [Candidate Name]"
- System automatically matches and confirms the candidate

### Speech Synthesis
- All candidates are read aloud when clicking the speaker icon
- Candidate details are spoken when selecting a candidate
- Vote confirmation is announced with audio feedback
- Error messages are also read aloud

**Note:** Voice features work best in Chrome, Edge, and Safari browsers.

---

## Keyboard Accessibility

AccessibleVote is **fully keyboard accessible** for users who prefer or require keyboard-only navigation.

### Skip Navigation
- Press **Tab** when page loads to reveal "Skip to main content" link
- Activating this link jumps directly to main content

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Tab** | Navigate to next interactive element |
| **Shift + Tab** | Navigate to previous element |
| **Enter** | Activate buttons and links |
| **Space** | Activate buttons and checkboxes |
| **Escape** | Close dialogs and modals |
| **Alt + H** | Navigate to Home page |
| **Alt + C** | Navigate to Election Calendar |
| **Alt + P** | Navigate to Profile |
| **Alt + V** | Navigate to Vote History |
| **Alt + S** | Navigate to Security Information |
| **?** | Show keyboard shortcuts help |

### Focus Management
- **Visible focus indicators:** All interactive elements show a blue outline when focused via keyboard
- **Focus traps:** Dialogs trap focus within them until closed
- **Focus restoration:** Focus returns to triggering element after closing dialogs
- **Logical tab order:** Navigation follows natural reading order

### Accessibility Features
- **ARIA labels** on all interactive elements for screen readers
- **Role attributes** for semantic structure
- **Live regions** for announcing dynamic content changes
- **Keyboard-only indicator:** Shows "Press ? for keyboard shortcuts" hint when navigating with keyboard

### Testing Keyboard Navigation
1. Open the application
2. Press **Tab** to start navigating
3. Use **Enter** or **Space** to activate elements
4. Press **?** to see all available keyboard shortcuts
5. Use **Alt + [key]** shortcuts for quick page navigation

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/votingSystem
JWT_SECRET=your-secret-key-minimum-32-characters

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# SMS Configuration (Vonage)
VONAGE_API_KEY=your-vonage-api-key
VONAGE_API_SECRET=your-vonage-api-secret
```

---

## Troubleshooting

- **Port already in use:** The app automatically finds the next available port
- **Database connection failed:** Ensure MongoDB is running with `mongod` command
- **Build errors:** Run `npm install` in both frontend and backend directories
- **Voice features not working:** 
  - Use Chrome, Edge, or Safari browser
  - Grant microphone permissions when prompted
  - Ensure HTTPS in production (localhost works in development)
- **CORS errors:** Verify both frontend and backend servers are running

---

## Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Voice Commands | ✅ | ✅ | ✅ | ⚠️ Limited |
| Speech Synthesis | ✅ | ✅ | ✅ | ✅ |
| High Contrast | ✅ | ✅ | ✅ | ✅ |
| Keyboard Nav | ✅ | ✅ | ✅ | ✅ |
| Screen Readers | ✅ | ✅ | ✅ | ✅ |

---

## License

This project is licensed under the MIT License.

---

## Support

For issues or questions, please open an issue on GitHub or contact the team.

---

**Made with ❤️ for an inclusive democracy**

