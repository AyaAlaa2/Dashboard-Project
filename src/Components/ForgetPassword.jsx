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
// import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './Firebase'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendPasswordResetEmail } from 'firebase/auth'

const ForgetPassword = () => {
  const link = useNavigate()
  const schema = z.object({
    email: z.string().email('Email Not Allowed')
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(schema)
  })

const hanldeResetPassword = async () => {
  const emailVal = watch('email');
  try {
    await sendPasswordResetEmail(auth, emailVal);
    toast.success('Check your email! A password reset link has been sent !');
    link('/login')
  } catch {
    toast.error('Oops! An Error Occurred !');
  }
};
  return (
    <div  className='w-full flex justify-center items-center h-[100vh] dark:bg-black bg-gray-200'>
      <Card className='w-full max-w-sm bg-gray-950 dark:bg-gray-200 shadow-2xl drop-shadow-[1px_1px_15px_rgb(200,200,200)]'>
        <CardHeader>
          <CardTitle className='font-bold text-3xl text-white dark:text-black'>
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(hanldeResetPassword)}>
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
            </div>
            <Button
              type='submit'
              className='w-full text-black bg-white/20 dark:text-white dark:bg-black text-xl cursor-pointer hover:shadow-lg transition duration-400 mt-5 cursor-pointer'
            >
              Reset
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgetPassword
