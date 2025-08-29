import React from 'react'
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
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadImageCloudinary } from './UploadImageCloudinary'

const Signup = () => {
  const link = useNavigate()
  const formSchema = z.object({
    name: z.string().min(2, 'Name must have more than 2 characters'),
    email: z.string().email('Invaled Email'),
    password: z.string().min(6, 'Password must have more than 6 characters')
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: null
    }
  })

  const handleSignup = async data => {
    try {
      const { name, email, password } = data

      const imageFile = watch('image')?.[0]
      let imageURL = ''
      if (imageFile) {
        imageURL = await UploadImageCloudinary(imageFile)
      }

      await createUserWithEmailAndPassword(auth, email, password)
      const user = auth.currentUser

      if (user) {
        await setDoc(doc(database, 'Users', user.uid), {
          id: user.uid,
          email: user.email,
          name: name,
          password: password,
          profileImage: imageURL
        })
      }

      link('/login')
      toast.success(`Signup Successfully! Welcome ${name}`)
    } catch {
      toast.error('Oops! Signup failed')
    }
  }

  return (
    <div className='w-full flex justify-center items-center h-[100vh] bg-gray-200 dark:bg-black'>
      <Card className='w-full max-w-sm bg-gray-950 dark:bg-gray-200 shadow-2xl drop-shadow-[1px_1px_15px_rgb(200,200,200)]'>
        <CardHeader>
          <CardTitle className='font-bold text-3xl text-white dark:text-black'>
            Sign Up{' '}
          </CardTitle>
          <CardAction>
            <Button
              variant='link'
              className='cursor-pointer text-white dark:text-black'
              onClick={() => link('/login')}
            >
              Log in
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSignup)}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='email' className='text-white dark:text-black'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  {...register('email')}
                  className='text-white dark:text-black dark:border dark:border-black'
                  placeholder='m@example.com'
                  required
                />
                {errors.email && (
                  <p className='text-red-500 text-sm'>{errors.email.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='name' className='text-white dark:text-black'>
                  Name
                </Label>
                <Input
                  id='name'
                  type='text'
                  className='text-white dark:text-black dark:border dark:border-black'
                  {...register('name')}
                  required
                />
                {errors.name && (
                  <p className='text-red-500 text-sm'>{errors.name.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label
                  htmlFor='password'
                  className='text-white dark:text-black'
                >
                  Password
                </Label>
                <Input
                  id='password'
                  type='password'
                  {...register('password')}
                  className='text-white dark:text-black dark:border dark:border-black'
                  required
                />
                {errors.password && (
                  <p className='text-red-500 text-sm'>
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='photo' className='text-white dark:text-black'>
                  Upload Image
                </Label>
                <Input
                  id='photo'
                  type='file'
                  accept='image/*'
                  {...register('image')}
                  className='text-white dark:text-black dark:border dark:border-black'
                  required
                />
              </div>
            </div>
            <Button
              type='submit'
              className='w-full text-black bg-white/20 dark:text-white dark:bg-black text-xl cursor-pointer hover:shadow-md transition duration-400 hover:bg-black/80 mt-5'
            >
              Signup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Signup
