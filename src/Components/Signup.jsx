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
    } catch (error) {
      toast.error('Oops! Signup failed')
    }
  }

  return (
    <div className='w-full flex justify-center items-center h-[100vh] bg-black'>
      <Card className='w-full max-w-sm bg-white shadow-2xl drop-shadow-[1px_1px_15px_rgb(200,200,200)]'>
        <CardHeader>
          <CardTitle className='font-bold text-3xl '>Sign Up </CardTitle>
          <CardAction>
            <Button
              variant='link'
              className='cursor-pointer'
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
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  {...register('email')}
                  placeholder='m@example.com'
                  required
                />
                {errors.email && (
                  <p className='text-red-500 text-sm'>{errors.email.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='name'>Name</Label>
                <Input id='name' type='text' {...register('name')} required />
                {errors.name && (
                  <p className='text-red-500 text-sm'>{errors.name.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  {...register('password')}
                  required
                />
                {errors.password && (
                  <p className='text-red-500 text-sm'>
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='photo'>Upload Image</Label>
                <Input
                  id='photo'
                  type='file'
                  accept='image/*'
                  {...register('image')}
                  required
                />
              </div>
            </div>
            <Button
              type='submit'
              className='w-full bg-black text-white text-xl cursor-pointer hover:shadow-md transition duration-400 hover:bg-black/80 mt-5'
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
