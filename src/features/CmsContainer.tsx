import React from 'react';
import { Route } from 'react-router';
import { withRouter } from 'react-router-dom';

import CMSRouteSections from './cms/route-sections';
import AccountEdit from './cms/account/AccountEdit';

function CmsContainer() {
  return (
    <>
      {CMSRouteSections.map(section => (
        <Route key={section.path} path={section.path} component={section.component} />
      ))}
      <Route exact={true} path='/cms/account/:id' component={AccountEdit} />
    </>
  );
}

export default withRouter(CmsContainer);
