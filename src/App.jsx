import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import RegistrationPage from "./pages/RegistrationPage";
import VibeQuiz from "./pages/VibeQuiz";
import VibeReveal from "./pages/VibeReveal";
import VibeMatch from "./pages/VibeMatch";
import VibeMatchDetail from "./pages/VibeMatchDetail";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/vibe-questions" element={<VibeQuiz />} />
        <Route path="/vibe-reveal" element={<VibeReveal />} />
        <Route path="/vibe-match" element={<VibeMatch />} />
        <Route path="/vibe-match-detail/:userId" element={<VibeMatchDetail />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Later add vibe selection and other pages */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
