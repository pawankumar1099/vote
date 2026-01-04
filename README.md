## Problem Statement

P.S 10 : Ensuring Equal Electoral Participation for Specially Abled Individuals

## Project Name

Project Name: AccessibleVote

## Team Name

Team Name: VIBER

## Members

1. Pawan Kumar
2. Prashant soni
3. Ritik Soni
4. priyanshu

## Deployed Link (optional)

Add deployed app link (if available):

## 2-minute Demonstration Video link

Add a 2-minute demo video link (YouTube/Drive):

## PPT Link

Project presentation (PPT) link: https://docs.google.com/presentation/d/1TrHVeZOIcqc9sij1QVUr9S3KXAbrX08p/edit?usp=sharing&ouid=106870957439834119286&rtpof=true&sd=true

---

## Project Overview

AccessibleVote is an accessibility-first voting assistance platform designed to enable specially abled individuals to participate in elections independently, securely, and with dignity. The system focuses on inclusive interface design by supporting voice guidance, keyboard-only navigation, screen-reader compatibility, high-contrast visuals, and privacy-preserving interactions. Built as a demonstrative prototype rather than a real election system, AccessibleVote highlights how thoughtful accessibility and assistive technologies can remove participation barriers, reduce dependence on third parties, and promote equal, barrier-free democratic participation for all voters.

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or cloud instance)
- Git

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ByteQuest-2025/GFGBQ-Team-viber.git
   cd viber-hackathone
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create .env file with required variables
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
   - Choose your candidate from the list
   - Confirm your vote
   - Receive confirmation with voice feedback

4. **View Vote History:**
   - Access "My Votes History" page
   - Review past voting activity

#### Accessibility Features

- **Screen Reader Support:** All elements have proper ARIA labels
- **Keyboard Navigation:** Full keyboard-only operation
- **High Contrast Mode:** Improved visibility for visually impaired
- **Voice Guidance:** Audio prompts for navigation and actions
- **Large Text Options:** Scalable interface elements

#### For Administrators

1. **Create Elections:**
   - POST `/api/elections` with election details (title, description, dates)

2. **Manage Candidates:**
   - Add candidates to elections via API
   - Update or remove candidates as needed

3. **Monitor Results:**
   - GET `/api/elections/:id/results` for election outcomes

### API Endpoints

#### Authentication
- `POST /register` - User registration
- `POST /verify` - Email/phone verification
- `POST /login` - User login

#### Elections
- `POST /elections` - Create election
- `GET /elections` - List all elections
- `GET /election/:id` - Get election details
- `PUT /elections/:id` - Update election
- `DELETE /elections/:id` - Delete election
- `GET /elections/:id/results` - Get election results

#### Candidates
- `POST /candidates/:electionId` - Add candidate to election
- `GET /candidate/:id` - Get candidate details
- `GET /candidates/:electionId` - List candidates for election
- `PUT /candidates/:electionId/:candidateId` - Update candidate
- `DELETE /candidates/:electionId/:candidateId` - Remove candidate

#### Voting
- `POST /votes` - Cast a vote
- `GET /my-votes` - Get user's vote history

### Environment Variables

Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/votingSystem
JWT_SECRET=your-secret-key
```

### Troubleshooting

- **Port already in use:** The app automatically finds the next available port
- **Database connection failed:** Ensure MongoDB is running
- **Build errors:** Run `npm install` in both frontend and backend directories


## Tech Stack

- **Frontend:** React, Material-UI, Axios (Accessibility-first UI with ARIA roles, high-contrast mode, keyboard navigation)
- **Backend:** Node.js, Express.js (RESTful API with JWT authentication)
- **Database:** MongoDB (NoSQL database for flexible data storage)
- **Additional Libraries:** Mongoose (ODM), bcrypt (password hashing), nodemailer (email), Vonage (SMS)

