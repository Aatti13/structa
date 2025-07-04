import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import CallPage from "./pages/CallPage.jsx";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { axiosInstance } from "./lib/axios.js";

// React Query
// Axios
function App() {
  const {data: authData, isLoading, error} = useQuery({
    queryKey: ["authUser"],
    queryFn: async ()=>{
      const res = await axiosInstance.get("http://localhost:3300/api/auth/me");

      return res.data
    },
    retry: false,
  });

  const authUser = authData?.user;

  return (
    <div className="h-screen" data-theme="night">
      <Routes>
        <Route path="/" element={authUser ? <HomePage/>: <Navigate to="/login"/>}/>
        <Route path="/register" element={!authUser ? <RegisterPage/>: <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/>: <Navigate to="/"/>}/>
        <Route path="/notifications" element={authUser ? <NotificationPage/>: <Navigate to="/login"/>}/>
        <Route path="/onboarding" element={authUser ? <OnboardingPage/>: <Navigate to="/login"/>}/>
        <Route path="/chat" element={authUser ? <ChatPage/> : <Navigate to="/login"/>}/>
        <Route path="/call" element={authUser ? <CallPage/>: <Navigate to="/login"/>}/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
