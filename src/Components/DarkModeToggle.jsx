import { useState, useEffect } from 'react'
import { IoMoon } from 'react-icons/io5'
import { FiSun } from 'react-icons/fi'

export default function DarkModeToggle () {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
    setIsDark(!isDark)
  }

  return (
    <button
      onClick={toggleTheme}
      className='px-6 py-2 rounded-full text-2xl bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900 dark:text-gray-100 absolute top-[20px] right-[50px]'
    >
      {isDark ? (
        <FiSun className='text-yellow-500' />
      ) : (
        <IoMoon className='text-white' />
      )}
    </button>
  )
}
