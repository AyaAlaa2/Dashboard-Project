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
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './Firebase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const Login = () => {
  const link = useNavigate()
  const schema = z.object({
    email: z.string().email('Email Not Allowed'),
    password: z.string().min(6, 'Password must have more than 6 characters')
  })
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  })

  const handleLogin = async data => {
    const { email, password } = data
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success(`Login Successfully!`)
      link('/dashboard')
    } catch {
      toast.error('Oops! Incrrect Email or password')
    }
  }
  return (
    <div className='w-full flex justify-center items-center h-[100vh] dark:bg-black bg-gray-200'>
      <Card className='w-full max-w-sm bg-gray-950 dark:bg-gray-200 shadow-2xl drop-shadow-[1px_1px_15px_rgb(200,200,200)]'>
        <CardHeader>
          <CardTitle className='font-bold text-3xl text-white dark:text-black'>
            Login
          </CardTitle>
          <CardAction>
            <Button
              variant='link'
              className='cursor-pointer text-white dark:text-black'
              onClick={() => link('/signup')}
            >
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)}>
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
                <div className='flex items-center'>
                  <Label
                    htmlFor='password'
                    className='text-white dark:text-black'
                  >
                    Password
                  </Label>
                  <Button
                    variant='link'
                    className='ml-auto inline-block text-sm underline-offset-4 cursor-pointer hover:underline text-white dark:text-black'
                    onClick={() => link('/resetPassword')}
                  >
                    Forgot your password?
                  </Button>
                </div>
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
            </div>
            <Button
              type='submit'
              className='w-full text-black bg-white/20 dark:text-white dark:bg-black text-xl cursor-pointer hover:shadow-lg transition duration-400 mt-5 cursor-pointer'
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
export default Login
