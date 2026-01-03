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

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="App">
      <BrowserRouter>
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
      </BrowserRouter>
    </div>
  );
}

export default App;
