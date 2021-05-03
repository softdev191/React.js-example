import React from 'react';
import { TextField as RMWCTextField, TextFieldProps as RMWCTextFieldProps } from '@rmwc/textfield';

import styled from '../styled-components';

const FullWidthTextField = styled(RMWCTextField)<RMWCTextFieldProps>`
  width: 100%;
  height: 44px;
`;

export type TextFieldProps = RMWCTextFieldProps & {
  name?: string;
  className?: string;
  onFocus?: (e: React.FocusEvent<any>) => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
};

function TextField(props: TextFieldProps) {
  const { className, ...rest } = props;
  return (
    <div className={className}>
      <FullWidthTextField {...rest} />
    </div>
  );
}

export default TextField;
