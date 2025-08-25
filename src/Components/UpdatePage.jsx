import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const UpdatePage = () => {
  const [userDetailes, setUserDetailes] = useState(null)
  const [loading, setLoading] = useState(true)

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

  useEffect(() => {
    fechData()
  }, [])

  const handleUpdate = async () => {
    auth.onAuthStateChanged(async user => {
      const userRef = doc(database, 'Users', user.uid)
      try {
        await updateDoc(userRef, {
          name: userDetailes.name,
          email: userDetailes.email
          // avatar: userDetailes.avatar
        })
        toast.success('Update Successfully !')
        window.location.href = '/dashboard'
      } catch (error) {
        toast.error('Oops ! Update failed')
      }
    })
  }

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
              Update Data
            </CardTitle>
            <Avatar className='w-12 h-12 inline-block'>
              <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent>
            <form>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-row gap-2'>
                  <Label htmlFor='email'>Email:</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='m@example.com'
                    value={userDetailes.email}
                    onChange={e => {
                      setUserDetailes({
                        ...userDetailes,
                        email: e.target.value
                      })
                    }}
                  />
                </div>
                <div className='flex flex-row gap-2'>
                  <Label htmlFor='FName'>Name:</Label>
                  <Input
                    id='FName'
                    type='text'
                    value={userDetailes.name}
                    onChange={e => {
                      setUserDetailes({ ...userDetailes, name: e.target.value })
                    }}
                  />
                </div>
                {/* <div className='flex flex-row gap-2'>
                  <Label htmlFor='Image'>Photo:</Label>
                  <Input id='Image' type='file' accept='/image' />
                </div> */}
              </div>
            </form>
          </CardContent>
          <CardFooter className='flex-col gap-2 mt-5'>
            <Button
              type='submit'
              className='w-full bg-black text-white text-xl cursor-pointer hover:shadow-md transition duration-400 hover:bg-black/80'
              onClick={handleUpdate}
            >
              Save
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
export default UpdatePage
