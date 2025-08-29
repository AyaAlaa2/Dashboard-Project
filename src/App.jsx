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
import PrivateRoute from './Components/PrivateRoute'
import DarkModeToggle from './Components/DarkModeToggle'
import ForgetPasswordPage from './Pages/ForgetPasswordPage'

function App () {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-20'>
        <div className='w-10 h-10 border-4 border-black dark:border-white rounded-full border-t-transparent animate-spin'></div>
      </div>
    )
  }
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <DarkModeToggle />

      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/resetPassword' element={<ForgetPasswordPage />} />
        <Route
          path='/dashboard'
          element={
            <PrivateRoute user={user}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/updateUser'
          element={
            <PrivateRoute user={user}>
              <UpdateDataPage />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster position='top-center' richColors={true} duration={4000} />
    </ThemeProvider>
  )
}

export default App
