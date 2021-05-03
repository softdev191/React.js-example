import { Button, ButtonProps } from '@rmwc/button';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import theme from '../constants/Theme';
import { RouteDefinition } from '../features/AppRouteSections';
import { UserContextType } from '../lib/user/user.context';
import styled from '../styled-components';

export type NavbarProps = {
  loggedInUser?: UserContextType;
};

export type NavLinkProps = ButtonProps & {
  section: RouteDefinition | undefined;
  onClick?: () => void;
};

const NavButton = styled(Link)`
  &&& {
    padding: 0 40px;
    background: ${theme.primary};
    border-radius: 2em !important;
    border-bottom: none;
    color: ${theme.white} !important;
  }
`;
const NavLink = styled((props: NavLinkProps) => {
  const { section = { path: '', isButton: false, name: '' }, onClick, ...rest } = props;

  return (
    // https://rmwc.io/library-integrations
    <Button
      {...rest}
      key={section.path}
      label={section.name}
      onClick={onClick}
      {...(section.path && {
        to: section.path,
        tag: section.isButton ? NavButton : Link
      })}
    />
  );
})`
  min-width: 0;
  margin: 0 15px;
  padding: 0;
  border-radius: 0px;
  font-size: 26px;
  font-weight: 800;
  white-space: nowrap;
  border-bottom: ${({ section }) => (section?.path === useLocation().pathname ? `1px solid ${theme.black};` : 'none')};
  &&& {
    color: ${theme.black};
    cursor: ${({ section }) => (section?.path === useLocation().pathname ? 'default' : 'pointer')};
    &:hover {
      color: ${({ section }) => (section?.path === useLocation().pathname ? 'auto' : theme.grey)};
    }
  }

  // removes hover, focus, and active highlight
  .mdc-button__ripple::before,
  .mdc-button__ripple::after {
    background-color: ${({ section }) => (section?.isButton ? 'auto' : 'unset')};
  }
`;

export default NavLink;
