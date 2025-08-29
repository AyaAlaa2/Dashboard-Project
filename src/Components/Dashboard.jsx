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
import { Label } from '@/Components/ui/label'
import { auth } from './Firebase'
import { useNavigate } from 'react-router-dom'
import { FetchUserData } from './FetchUserData'
import { Logout } from './Logout'
import { SendValidation } from './SendValidation'

const Dashboard = () => {
  const [userDetailes, setUserDetailes] = useState(null)
  const [loading, setLoading] = useState(true)
  const link = useNavigate()

  useEffect(() => {
    FetchUserData({
      onSuccess: data => {
        setUserDetailes(data)
        setLoading(false)
      },
      onFail: () => setLoading(false)
    })
  }, [])

  return (
    <div className='w-full flex justify-center items-center h-[100vh] dark:bg-black bg-gray-200'>
      {loading ? (
        <div className='flex justify-center items-center h-20'>
          <div className='w-10 h-10 border-4 border:black dark:border-white rounded-full border-t-transparent animate-spin'></div>
        </div>
      ) : (
        <Card className='w-full max-w-sm bg-gray-950 dark:bg-gray-200 shadow-2xl drop-shadow-[1px_1px_15px_rgb(200,200,200)]'>
          <CardHeader className='grid grid-cols-[1fr_auto] justify-between w-full'>
            <CardTitle className='font-bold text-3xl uppercase text-white dark:text-black'>
              WELCOME
            </CardTitle>
            <Avatar className='w-12 h-12 inline-block'>
              <AvatarImage
                src={userDetailes.profileImage}
                alt='Profile picture'
              />
              <AvatarFallback>Image</AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent>
            <div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col'>
                  <div className='flex flex-row gap-2'>
                    <Label className='text-white dark:text-black'>
                      Email :
                    </Label>
                    <p className='text-white dark:text-black'>
                      {userDetailes.email}
                    </p>
                  </div>
                  {userDetailes.email !== auth.currentUser.email && (
                    <p className='text-red-500 text-sm mt-2 ps-3'>
                      You must activate your new email
                    </p>
                  )}
                </div>
                <div className='flex flex-row gap-2'>
                  <Label className='text-white dark:text-black'>Name :</Label>
                  <p className='text-white dark:text-black'>
                    {userDetailes.name}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex-col gap-2 mt-5'>
            <Button
              type='submit'
              className='w-full text-black bg-white/20 dark:text-white dark:bg-black text-xl cursor-pointer hover:shadow-md transition duration-400 hover:bg-black/80'
              onClick={() => {
                link('/updateUser')
              }}
            >
              Update
            </Button>

            <SendValidation />
            <Logout />
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default Dashboard
