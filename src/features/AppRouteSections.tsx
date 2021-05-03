import React from 'react';
import { Switch } from 'react-router-dom';
import { ProtectedRoute } from '../components';
import TitledRoute from '../components/TitledRoute';
import AdminGuard from '../lib/user/admin.guard';
import CmsContainer from './CmsContainer';

import LogIn from './login/Login';
import LoginCheck from './LoginCheck';
import NotFound from './NotFound';

export type RouteDefinition = {
  name: string;
  path: string;
  isButton?: boolean;
  noUI?: boolean;
  component: () => JSX.Element;
};
export type RouteSection = 'visitor' | 'account' | 'general' | 'marketingFooter' | 'footer';

/** Declares the routes only. For rendering as UI, refer to Header. */
function AppRouteSections(): JSX.Element {
  return (
    <Switch>
      {/* Protected routes */}
      <ProtectedRoute guards={[AdminGuard]} path='/cms' component={CmsContainer} />
      <TitledRoute exact path='/'>
        <LoginCheck />
      </TitledRoute>
      <TitledRoute exact path='/login'>
        <LogIn />
      </TitledRoute>
      <TitledRoute title='404'>
        <NotFound />
      </TitledRoute>
    </Switch>
  );
}

export default AppRouteSections;
