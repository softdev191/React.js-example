import React, { PropsWithChildren, useEffect } from 'react';
import { Route, RouteProps } from 'react-router-dom';

function TitledRoute(props: PropsWithChildren<RouteProps & { title?: string }>) {
  const { title = '', children, ...rest } = props;
  useEffect(() => {
    document.title = `BidVita ${title && '- ' + title}`;
  }, [title]);
  return <Route {...rest}>{children}</Route>;
}

export default TitledRoute;
