import { useContext } from 'react';

import { UserContext, UserContextType, UserSetStateActionDispatch } from './user.context';

function useUser(user?: UserContextType): [UserContextType, UserSetStateActionDispatch] {
  const userContext = useContext(UserContext);
  if (user) {
    userContext.setUser(user);
  }
  return [userContext.user, userContext.setUser];
}

export default useUser;
