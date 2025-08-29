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
import { auth, database } from './Firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendEmailVerification,
  verifyBeforeUpdateEmail
} from 'firebase/auth'
import { UploadImageToCloudinary } from './uploadImageToCloudinary'
import { FetchUserData } from './FetchUserData'

const UpdatePage = () => {
  const [loading, setLoading] = useState(true)
  const [profileImageURL, setProfileImageURL] = useState('')
  const [newImageFile, setNewImageFile] = useState(null)

  const link = useNavigate()
  const schema = z.object({
    name: z.string().min(2, 'Name must have more than 2 characters'),
    email: z.string().email('Your email not allowed')
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' }
  })

  useEffect(() => {
    FetchUserData({
      onSuccess: data => {
        reset({
          name: data.name || '',
          email: data.email || ''
        })
        setProfileImageURL(data.profileImage || '')
        setLoading(false)
      },
      onFail: () => setLoading(false)
    })
  }, [reset])

  const handleUpdate = async data => {
    const user = auth.currentUser
    if (!user) return toast.error('user not logged in')

    try {
      let newImageURL = profileImageURL

      if (newImageFile) {
        newImageURL = await UploadImageToCloudinary(newImageFile)
      }

      if (user.email !== data.email) {
        const password = prompt('Enter your current password : ')
        const credential = EmailAuthProvider.credential(user.email, password)
        await reauthenticateWithCredential(user, credential)
        await verifyBeforeUpdateEmail(user, data.email, {
          url: `${window.location.origin}/login`,
          handleCodeInApp: true
        })
      }

      await updateDoc(doc(database, 'Users', user.uid), {
        name: data.name,
        email: data.email,
        profileImage: newImageURL
      })
      setProfileImageURL(newImageURL)
      toast.success('Update Successfully !')
      link('/dashboard')
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Oops ! Update failed')
    }
  }

  const changePhoto = e => {
    if (e.target.files && e.target.files[0]) {
      setNewImageFile(e.target.files[0])
    }
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
              <AvatarImage src={profileImageURL} alt='Profile picture' />
              <AvatarFallback>Image</AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleUpdate)}>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                  <div className='flex flex-row gap-2'>
                    <Label htmlFor='email'>Email:</Label>
                    <Input id='email' type='email' {...register('email')} />
                  </div>
                  {errors.email && (
                    <p className='text-red-500'>{errors.email.message}</p>
                  )}
                </div>
                <div className='felx flex-col gap-2'>
                  <div className='flex flex-row gap-2'>
                    <Label htmlFor='name'>Name:</Label>
                    <Input id='name' type='text' {...register('name')} />
                  </div>
                  {errors.name && (
                    <p className='text-red-500'>{errors.name.message}</p>
                  )}
                </div>
                <div className='flex flex-row gap-2'>
                  <Label htmlFor='Image'>Photo:</Label>
                  <Input
                    id='Image'
                    type='file'
                    accept='image/*'
                    onChange={changePhoto}
                  />
                </div>
              </div>
              <Button
                type='submit'
                className='w-full bg-black text-white text-xl cursor-pointer hover:shadow-md transition duration-400 hover:bg-black/80 mt-5'
              >
                Save
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
export default UpdatePage
