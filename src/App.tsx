import { Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LessonPage } from "./pages/LessonPage";
import { SimulationPage } from "./sim/SimulationPage";

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
      </Routes>
    </div>
  );
}

export default App;
