import React, { useState } from 'react'
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
    } catch (e) {
      toast.error('Oops! Incrrect Email or password')
    }
  }
  return (
    <div className='w-full flex justify-center items-center h-[100vh] bg-black'>
      <Card className='w-full max-w-sm bg-white shadow-2xl drop-shadow-[1px_1px_15px_rgb(200,200,200)]'>
        <CardHeader>
          <CardTitle className='font-bold text-3xl'>Login</CardTitle>
          <CardAction>
            <Button
              variant='link'
              className='cursor-pointer'
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
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <a
                    href='#'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </a>
                </div>
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
            </div>
            <Button
              type='submit'
              className='w-full bg-black text-white text-xl cursor-pointer hover:shadow-lg transition duration-400 mt-5'
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
