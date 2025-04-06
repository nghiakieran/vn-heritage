import { LogIn, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '~/components/common/ui/button'

const AuthButton = () => {
  return (
    <>
      <Link to='/login'>
        <Button variant='ghost'>
          <LogIn size={20} />
          <span>Đăng nhập</span>
        </Button>
      </Link>
      <Link to='/register'>
        <Button>
          <UserPlus size={20} />
          <span>Đăng ký</span>
        </Button>
      </Link>
    </>
  )
}

export default AuthButton
