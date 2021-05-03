import React from 'react';
import { Route, Switch } from 'react-router';

import UserList from './UserList';

function UserModule() {
  return (
    <Switch>
      <Route exact path='/cms/users' component={UserList} />
    </Switch>
  );
}

export default UserModule;
