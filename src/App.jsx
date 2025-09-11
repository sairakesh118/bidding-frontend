// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Auth from './pages/auth';
import BiddingItemsPage from './pages/BiddingItemsPage';
import './App.css';
import BidDetailPage from './pages/BidDetailPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import BidPostForm from './pages/BidPostForm';
import NotFoundPage from './pages/NotFoundPage';
import Register from './components/register';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/register" element={<Register />} />
      <Route path="/bidding-items" element={<BiddingItemsPage />} />
       <Route path="/bids/:id" element={<BidDetailPage />} />
       <Route path="/profile" element={<ProfilePage />} />
       <Route path="/" element={<LandingPage />} />
       <Route path="/create-bid" element={<BidPostForm/>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
