import { Guard } from '../../types/types';
import useUser from './useUser';

function UserGuard(): Guard {
  const [user] = useUser();

  return {
    canActivate: () => {
      return !!user;
    }
  };
}

export default UserGuard;
