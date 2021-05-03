import UserModule from './users/UserModule';

type RouteDefintion = {
  icon?: JSX.Element | null;
  name: string;
  path: string;
  component: () => JSX.Element;
};

export const CMSRouteSections: RouteDefintion[] = [
  {
    icon: null,
    name: 'Users',
    path: '/cms/users',
    component: UserModule
  }
];

export default CMSRouteSections;
