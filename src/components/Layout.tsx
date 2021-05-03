import React, { PropsWithChildren, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import Box, { BoxProps } from './Box';
import styled from '../styled-components';
import { patternHeader } from '../assets/images';
import { patternFooter } from '../assets/images';
import Content from './Content';
import Header from './Header';

type BackgroundOptions = {
  headerHidden?: boolean;
  hidePatternFooter?: boolean;
};
type LayoutProps = PropsWithChildren<RouteComponentProps & BoxProps & BackgroundOptions>;

const getPatternStyles = (options: BackgroundOptions) => {
  const { headerHidden, hidePatternFooter } = options;

  const headerTop = !headerHidden ? -150 : 0;
  const footerImg = !hidePatternFooter ? `url(${patternFooter})` : 'none';
  const footerPosition = !hidePatternFooter ? 'left 8% bottom 0' : 0;

  return `
    background-image: url(${patternHeader}), ${footerImg};
    background-position: right 8% top ${headerTop}px, ${footerPosition};
    background-repeat: no-repeat, no-repeat;
    background-size: 500px, 500px;
  `;
};

const Container = styled(Box)`
  width: inherit;
  height: auto;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const BackgroundContainer = styled((props: PropsWithChildren<BackgroundOptions>) => {
  const { children, ...rest } = props;
  return <Box {...rest}>{children}</Box>;
})`
  ${props => getPatternStyles(props)}
  max-width: 1950px;
  width: 130%;
  display: flex;
  align-self: center;
`;

/**
 * Provides the header based on routes available in AppRouteSections.
 * Usage: use as root element in your feature component.
 */
function Layout(props: LayoutProps) {
  const { headerHidden, hidePatternFooter, children, ...rest } = props;

  useEffect(() => {
    const body = document.querySelector('#root');
    body?.scrollIntoView({ behavior: 'smooth' });
  }, []); // eslint-disable-line

  return (
    <>
      <Container className='app-layout'>
        {!headerHidden && <Header />}
        <BackgroundContainer headerHidden={headerHidden} hidePatternFooter={hidePatternFooter}>
          <Content {...rest}>{children}</Content>
        </BackgroundContainer>
      </Container>
    </>
  );
}

export default withRouter(Layout);
