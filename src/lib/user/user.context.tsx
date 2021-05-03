import React, { useState, useEffect } from 'react';

import { CircularProgress } from '@rmwc/circular-progress';

import styled from '../../styled-components';
import { User } from '../../types/User';
import { useGetCurrentUser } from '../api/User.hooks';

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

function Spinner() {
  return (
    <SpinnerContainer>
      <CircularProgress size='large' />
    </SpinnerContainer>
  );
}

export type UserContextType = User | null | undefined;
export type UserSetStateActionDispatch = React.Dispatch<React.SetStateAction<UserContextType>>;
type UserContextState = {
  user: UserContextType;
  setUser: UserSetStateActionDispatch;
};
const UserContext = React.createContext<UserContextState>({
  user: undefined,
  setUser: () => {}
});

type UserProviderProps = {
  children: JSX.Element;
};

function UserProvider(props: UserProviderProps) {
  const { children } = props;
  const [user, setUser] = useState<UserContextType>(undefined);
  const { data, get } = useGetCurrentUser();

  useEffect(() => {
    get();
  }, [get]);

  useEffect(() => {
    setUser(data);
  }, [setUser, data]);

  if (user === undefined) {
    // Do not load the children of the provider if the user is undefined.
    // Lets further wait...
    // undefined = we have not determined the login state yet
    // null = not logged in
    // User value = logged in
    return <Spinner />;
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };
export default UserProvider;
