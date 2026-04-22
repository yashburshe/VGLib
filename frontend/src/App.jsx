import { BrowserRouter, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/main.css";

import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/login_page.jsx";
import ProfilePage from "./pages/profile_page.jsx";
import GamesPage from "./pages/GamesPage.jsx";
import NavBar from "./components/Nav.jsx";
import GameDetailsPage from "./pages/GameDetailsPage.jsx";
import TopGamesPage from "./pages/TopGames.jsx";
import ListDetailsPage from "./pages/ListDetailsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import UserPage from "./pages/UserPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:userId" element={<UserPage />} />
        <Route path="/games/:gameId" element={<GameDetailsPage />} />
        <Route path="/lists/:listId" element={<ListDetailsPage />} />
        <Route path="/top" element={<TopGamesPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
