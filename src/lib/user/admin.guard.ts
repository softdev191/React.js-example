import { Guard } from '../../types/types';
import useUser from './useUser';

function AdminGuard(): Guard {
  const [user] = useUser();

  return {
    canActivate: () => {
      return user && user.roles && user.roles.find(r => r.name === 'Admin');
    }
  };
}

export default AdminGuard;
