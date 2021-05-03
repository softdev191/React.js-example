import React, { PropsWithChildren } from 'react';
import theme from '../constants/Theme';
import styled from '../styled-components';
import { Box, Text } from './';
import { BoxProps } from './Box';

const StyledLabel = styled(Text)`
  font-family: Chathura;
  font-weight: 800;
  text-transform: uppercase;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: 2.5px;
`;

// replaces the helpText prop in RMWC that has a lot of issues
const StyledHelpText = styled.sup`
  color: ${theme.destructiveColor};
  display: block;
  text-align: right;
  min-height: 18px;
`;

function FormField(props: PropsWithChildren<{ label: string; validationMsg?: string } & BoxProps>) {
  const { children, validationMsg, label, ...boxProps } = props;
  return (
    <Box {...(boxProps as any)}>
      <StyledLabel>{label}</StyledLabel>
      {children}

      <StyledHelpText>{validationMsg}</StyledHelpText>
    </Box>
  );
}

export default FormField;
