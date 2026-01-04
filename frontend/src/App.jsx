import { useEffect } from 'react';
import Login from "./pages/login/Login";
import ValidateLogin from "./pages/validateLogin/ValidateLogin";
import Register from "./pages/register/Register";
import VerifyEmailPhone from "./pages/verifyEmailPhone/VerifyEmailPhone";
import Home from "./pages/home/Home";
import SecurityInformation from "./pages/securityInformation/SecurityInformation";
import ElectionCalendar from "./pages/electionCalendar/ElectionCalendar";
import ElectionDetails from './pages/electionDetails/ElectionDetails';
import ElectionResult from './pages/electionResult/ElectionResult';
import MyVotesHistory from './pages/myVotesHistory/MyVotesHistory';
import Profile from './pages/profile/Profile';

import { useAuth } from './AuthContext';
import { initSkipLinks, initFocusVisible, globalShortcuts } from './utils/keyboardNavigation';
import { useNavigate } from 'react-router-dom';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize keyboard accessibility features
    initSkipLinks();
    initFocusVisible();

    // Register global keyboard shortcuts
    if (isAuthenticated()) {
      globalShortcuts.register('h', () => navigate('/home'), 'Navigate to Home', false, true);
      globalShortcuts.register('c', () => navigate('/calendar'), 'Navigate to Calendar', false, true);
      globalShortcuts.register('p', () => navigate('/profile'), 'Navigate to Profile', false, true);
      globalShortcuts.register('v', () => navigate('/history'), 'Navigate to Vote History', false, true);
      globalShortcuts.register('s', () => navigate('/security'), 'Navigate to Security', false, true);
    }

    return () => {
      // Cleanup shortcuts on unmount
      globalShortcuts.unregister('Alt+h');
      globalShortcuts.unregister('Alt+c');
      globalShortcuts.unregister('Alt+p');
      globalShortcuts.unregister('Alt+v');
      globalShortcuts.unregister('Alt+s');
    };
  }, [isAuthenticated, navigate]);

  return (
    <>
      {/* Skip to main content link for keyboard navigation */}
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      
      <div className="App" role="document" aria-label="AccessibleVote">
        <main id="main-content" role="main">
          <Routes>
          <Route path="/">
            <Route index element={<Login/>}/>
            <Route path="validateLogin" element={<ValidateLogin/>}/>
            <Route path="register" element={<Register/>}/>
            <Route path="verifyEmailPhone" element={<VerifyEmailPhone/>}/>
            <Route path="home" element={
            (isAuthenticated()) ? <Home/> : <Navigate to="/" replace />
            }/>
            <Route path="security" element={
            (isAuthenticated()) ? <SecurityInformation/> : <Navigate to="/" replace />
            }/>
            <Route path="calendar" element={
            (isAuthenticated()) ? <ElectionCalendar/> : <Navigate to="/" replace />
            }/>
            <Route path="/elections/:id" element={
            (isAuthenticated()) ? <ElectionDetails/> : <Navigate to="/" replace />
            }/>
            <Route path="/electionsResult/:id" element={
            (isAuthenticated()) ? <ElectionResult/> : <Navigate to="/" replace />
            }/>
            <Route path="/history" element={
            (isAuthenticated()) ? <MyVotesHistory/> : <Navigate to="/" replace />
            }/>
            <Route path="/profile" element={
            (isAuthenticated()) ? <Profile/> : <Navigate to="/" replace />
            }/>
          </Route>
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
