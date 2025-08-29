import React, { useState, useEffect } from 'react'
import './App.css'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/Components/ui/sonner'
import { Route, Routes } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './Components/Firebase'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import DashboardPage from './Pages/DashboardPage'
import UpdateDataPage from './Pages/UpdateDataPage'

function App ({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route path='/updateUser' element={<UpdateDataPage />} />
      </Routes>
      <Toaster position='top-center' richColors={true} duration={4000} />
    </ThemeProvider>
  )
}

export default App
