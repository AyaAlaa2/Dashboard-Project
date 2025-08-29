import { auth } from './Firebase'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/Components/ui/button'

export const Logout = () => {
  const link = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      link('/login')
    } catch {
      toast.error('Oops ! An error Occured')
    }
  }

  return (
    <Button
      type='submit'
      className='w-full text-black bg-white/20 dark:text-white dark:bg-black text-xl cursor-pointer hover:shadow-md transition duration-400 hover:bg-black/80'
      onClick={() => handleLogout()}
    >
      Log out
    </Button>
  )
}
