import React from 'react';
import { RouteProps, Redirect } from 'react-router';

import { GuardFunc } from '../types/types';
import TitledRoute from './TitledRoute';

type ProtectedRouteProps = RouteProps & {
  guards?: Array<GuardFunc>;

  // Will use to redirect when all guards failed to activate
  // By default it will redirect to `/login`
  redirectTo?: string;
};

function ProtectedRoute(props: ProtectedRouteProps) {
  const { guards = [], redirectTo = '/login' } = props;

  const isAllowed = guards.some(guard => guard().canActivate());
  if (!isAllowed) {
    return <Redirect to={redirectTo} />;
  }
  return <TitledRoute {...props} />;
}

export default ProtectedRoute;
