import React, { useState, useEffect } from 'react'
import Login from './Components/Login'
import './App.css'
import { ThemeProvider } from 'next-themes'
import Signup from './Components/Signup'
import { Toaster } from '@/Components/ui/sonner'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Components/Dashboard'
import UpdatePage from './Components/UpdatePage'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './Components/Firebase'

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
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/updateUser' element={<UpdatePage />} />
      </Routes>
      <Toaster position='top-center' richColors={true} duration={4000} />
    </ThemeProvider>
  )
}

export default App
