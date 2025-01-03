import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import NBAPage from "./pages/NBA/NBA";
import PlayerPage from "./pages/PlayerPage/PlayerPage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/nba" element={<NBAPage />} />
          <Route path="/player-page" element={<PlayerPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
