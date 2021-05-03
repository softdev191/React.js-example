import React from 'react';
import { useHistory } from 'react-router-dom';

import { Box, Image } from './';
import styled from '../styled-components';
import { RouteDefinition } from '../features/AppRouteSections';
import { useLogout } from '../lib/api/User.hooks';
import { logo } from '../assets/images/';
import NavLink, { NavbarProps } from './NavLink';

const NavSection = styled(Box)`
  display: flex;
  flex: auto;
`;

export const AppNavbar = (props: NavbarProps) => {
  const { doLogout } = useLogout();
  const history = useHistory();
  const { loggedInUser } = props;

  const handleLogout = async () => {
    await doLogout();
    history.push('/login');
  };

  const editAccount = () => {
    if (loggedInUser) {
      history.push(`/cms/account/${loggedInUser.id}`);
    }
  };

  return (
    <Box variant='centeredRow' height={100} px={[13, 17, 30, 45]} maxWidth={1440} margin='auto' overflow='auto hidden'>
      <NavSection justifyContent='flex-start'>
        <Image src={logo} height={35} mr={4} onClick={() => history.push('/cms/users')} />
        <NavLink section={{ path: '/cms/users', name: 'Users' } as RouteDefinition} onClick={() => history.push('/cms/users')} />
      </NavSection>

      <NavSection justifyContent='flex-end'>
        {!!loggedInUser && (
          <>
            <NavLink section={{ path: `/cms/account/${loggedInUser.id}`, name: 'Account' } as RouteDefinition} onClick={editAccount} />
            <NavLink section={{ name: 'Sign Out' } as RouteDefinition} onClick={handleLogout} />
          </>
        )}
      </NavSection>
    </Box>
  );
};

export default AppNavbar;
