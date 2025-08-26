import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar'
import { Button } from '@/Components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/Components/ui/card'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { toast } from 'sonner'
import { auth, database, storage } from './Firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'

const Dashboard = () => {
  const [userDetailes, setUserDetailes] = useState(null)
  const [loading, setLoading] = useState(true)
  const link = useNavigate()
  const fechData = async () => {
    auth.onAuthStateChanged(async user => {
      const docSnap = await getDoc(doc(database, 'Users', user.uid))
      if (docSnap.exists()) {
        setUserDetailes(docSnap.data())
        setLoading(false)
      } else {
        console.log('User in not Log in')
        setLoading(false)
      }
    })
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.href = '/login'
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fechData()
  }, [])
  return (
    <div className='w-full flex justify-center items-center h-[100vh] bg-black'>
      {loading ? (
        <div className='flex justify-center items-center h-20'>
          <div className='w-10 h-10 border-4 border-white rounded-full border-t-transparent animate-spin'></div>
        </div>
      ) : (
        <Card className='w-full max-w-sm bg-white shadow-2xl drop-shadow-[1px_1px_15px_rgb(200,200,200)]'>
          <CardHeader className='grid grid-cols-[1fr_auto] justify-between w-full'>
            <CardTitle className='font-bold text-3xl uppercase'>
              WELCOME
            </CardTitle>
            <Avatar className='w-12 h-12 inline-block'>
              <AvatarImage
                src='https://github.com/shadcn.png'
                alt='Profile picture'
              />
              <AvatarFallback>Image</AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent>
            <div>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-2'>
                  <Label>Email :</Label>
                  <p>{userDetailes.email}</p>
                </div>
                <div className='flex flex-row gap-2'>
                  <Label htmlFor='FName'>Name :</Label>
                  <p>{userDetailes.name}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex-col gap-2 mt-5'>
            <Button
              type='submit'
              className='w-full bg-black text-white text-xl cursor-pointer hover:shadow-md transition duration-400 hover:bg-black/80'
              onClick={() => {
                link('/updateUser')
              }}
            >
              Update
            </Button>
            <Button
              type='submit'
              className='w-full bg-black text-white text-xl cursor-pointer hover:shadow-md transition duration-400 hover:bg-black/80'
              onClick={() => {
                handleLogout()
              }}
            >
              Log out
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default Dashboard
