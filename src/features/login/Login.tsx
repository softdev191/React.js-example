import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@rmwc/circular-progress';
import { Form, Formik, FormikHelpers as FormikActions } from 'formik';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';

import { Layout, TextField, Text, Box, FormField } from '../../components/';
import styled from '../../styled-components';
import { ErrorMessages } from '../../constants/Strings';
import { LogInDTO, useLogin } from '../../lib/api/User.hooks';
import Button, { ButtonProps } from '../../components/Button';

const LogInSchema = Yup.object().shape({
  username: Yup.string()
    .required(ErrorMessages.REQUIRED_USERNAME)
    .test('alphanumericWithUnderScore', ErrorMessages.INVALID_USERNAME_FORMAT, function(value) {
      const ALPHANUMERIC_UNDERSCORE = /^[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*$/; // starts with alpha and contain numbers, underscores.
      return ALPHANUMERIC_UNDERSCORE.test(value || '');
    }),
  password: Yup.string().required(ErrorMessages.REQUIRED_PASSWORD)
});

const FormContainer = styled(Form)`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ErrorContainer = styled.div`
  flex: 1;
  color: red;
`;

const BottomContainer = styled.div`
  margin-top: 16px;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Spinner = styled(CircularProgress)`
  color: white;
  margin-right: 4px;
`;

const LoginFormButton = styled(Button)<ButtonProps>`
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 22px;
  max-width: 284px;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
  align-self: stretch;
`;

function LogIn() {
  const history = useHistory();
  const { data: loggedInUser, doLogin } = useLogin();
  const [visiblePW, setVisiblePW] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (values: LogInDTO, actions: FormikActions<LogInDTO>) => {
    actions.setSubmitting(true);
    await doLogin(values.username, values.password);
    actions.setSubmitting(false);
  };

  useEffect(() => {
    if (loggedInUser) {
      if (loggedInUser && loggedInUser.roles && loggedInUser.roles.find(r => r.name === 'Admin')) {
        history.replace('/');
      } else {
        setLoginError('You do not have sufficient permissions.');
      }
    }
  }, [loggedInUser]); // eslint-disable-line

  const handleFocus = () => setLoginError('');

  return (
    <Layout variant='centeredColumn' headerHidden height='100vh !important'>
      <Box my='auto' maxWidth={450} minWidth={387} width='26vw'>
        <Text variant='title' mb={92}>
          BidVita CMS
        </Text>
        <Formik initialValues={{ username: '', password: '' }} validationSchema={LogInSchema} validateOnBlur={true} onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <FormContainer>
              <FormField label='Username' validationMsg={touched.username && errors.username ? errors.username : ''}>
                <StyledTextField
                  name='username'
                  rootProps={{ autoComplete: 'false' }}
                  outlined
                  type='text'
                  floatLabel={false}
                  onFocus={handleFocus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                />
              </FormField>

              <FormField label='Password' validationMsg={touched.password && errors.password ? errors.password : ''}>
                <StyledTextField
                  name='password'
                  rootProps={{ autoComplete: 'false' }}
                  outlined
                  type={visiblePW ? 'text' : 'password'}
                  onFocus={handleFocus}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  trailingIcon={{
                    icon: visiblePW ? 'visibility' : 'visibility_off',
                    style: { outline: 'none' },
                    tabIndex: 0,
                    onMouseDown: () => setVisiblePW(true),
                    onMouseUp: () => setVisiblePW(false)
                  }}
                />
              </FormField>

              <ErrorContainer>{loginError}</ErrorContainer>
              <BottomContainer>
                <LoginFormButton variant='primary' type='submit' disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : null}
                  Sign in
                </LoginFormButton>
                <LoginFormButton
                  variant='outline'
                  type='button'
                  onClick={() => {
                    history.push('/recover-password');
                  }}
                >
                  Recover Password
                </LoginFormButton>
              </BottomContainer>
            </FormContainer>
          )}
        </Formik>
      </Box>
    </Layout>
  );
}

export default LogIn;
