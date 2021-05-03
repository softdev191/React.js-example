import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';

import { SnackbarQueue } from '@rmwc/snackbar';

import { ThemeProvider } from './styled-components';
import theme, { GlobalThemeStyle } from './constants/Theme';
import MediaProvider from './lib/media/media.context';
import UserProvider from './lib/user/user.context';
import CmsSnackbarQueue from './lib/CmsSnackbarQueue';
import AppRouteSections from './features/AppRouteSections';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <GlobalThemeStyle />
        <BrowserRouter>
          <QueryParamProvider ReactRouterRoute={Route}>
            <MediaProvider>
              <UserProvider>
                <div className='App'>
                  <AppRouteSections />
                  <SnackbarQueue messages={CmsSnackbarQueue.messages} />
                </div>
              </UserProvider>
            </MediaProvider>
          </QueryParamProvider>
        </BrowserRouter>
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
