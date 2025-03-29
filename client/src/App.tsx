import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import NBAPage from "./pages/NBA/NBA";
import PlayerPage from "./pages/PlayerPage/PlayerPage";

import SignUp from "./pages/Authentication/SignUp";
import Login from "./pages/Authentication/Login";

import NavbarLayout from "./layouts/NavbarLayout";
import ConfirmEmail from "./pages/Authentication/ConfirmEmail";
import Account from "./pages/Account/Account";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />

          <Route
            path="/nba"
            element={
              <PrivateRoute>
                <NBAPage />
              </PrivateRoute>
            }
          />

          <Route element={<NavbarLayout />}>
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />

            <Route
              path="/player-page"
              element={
                <PrivateRoute>
                  <PlayerPage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
