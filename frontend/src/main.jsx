import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import App from './App.jsx'
import LoginPage from './pages/login_page.jsx'
import ProfilePage from './pages/profile_page.jsx'
import GamesPage from './pages/GamesPage.jsx';
import NavBar from './components/Nav.jsx';
import GameDetailsPage from './pages/GameDetailsPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <NavBar/>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/games" element={<GamesPage/>}/>
        <Route path='/games/:gameId' element={<GameDetailsPage/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
