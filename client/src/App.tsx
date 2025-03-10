import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import NBAPage from "./pages/NBA/NBA";
import PlayerPage from "./pages/PlayerPage/PlayerPage";

import NavbarLayout from "./layouts/NavbarLayout";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/nba" element={<NBAPage />} />
          <Route element={<NavbarLayout />}>
            <Route path="/player-page" element={<PlayerPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
