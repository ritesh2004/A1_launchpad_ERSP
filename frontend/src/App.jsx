import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './page/Home'
import Login from './page/Login'
import Signup from './page/Signup'
import AuthContext from './context/Authcontext'
import { getProfile } from './api/getprofile'

function App() {
  const { user, setUser } = useContext(AuthContext);

  const getUser = async () => {
    const res = await getProfile();
    if (res.error) {
      console.error("Failed to fetch user profile:", res.error);
      return;
    }
    setUser(res.user);
    console.log("User profile fetched successfully:", res);
  }

  useEffect(() => {
    // Check for user authentication status
    getUser();
  },[])

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  </>
  )
}

export default App
