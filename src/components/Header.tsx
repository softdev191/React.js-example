import React from 'react';

import { Box, AppNavbar } from './';
import styled from '../styled-components';
import useUser from '../lib/user/useUser';
import theme from '../constants/Theme';

const Container = styled(Box)`
  width: 100%;
  z-index: 50;
  box-shadow: 0 20px 20px -20px rgba(0, 0, 0, 0.19);
  background: ${theme.white};
`;

export const Header = () => {
  const [user] = useUser();

  return (
    <Container>
      <AppNavbar loggedInUser={user} />
    </Container>
  );
};

export default Header;
