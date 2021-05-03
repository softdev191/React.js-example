import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { CircularProgress } from '@rmwc/circular-progress';

import { Form, Formik, FormikHelpers as FormikActions } from 'formik';
import * as Yup from 'yup';

import { ErrorMessages } from '../../../constants/Strings';
import TextField from '../../../components/TextField';
import { useGetUser, UserUpdateDTO, useUpdateUser } from '../../../lib/api/User.hooks';
import CmsSnackbarQueue from '../../../lib/CmsSnackbarQueue';
import styled from '../../../styled-components';
import useUser from '../../../lib/user/useUser';
import Defaults from '../../../constants/Defaults';
import { Box, FormField, Layout, Text } from '../../../components';
import Button, { ButtonProps } from '../../../components/Button';

type AccountEditProps = RouteComponentProps<{ id: string }>;
type AccountFormType = {
  username: string;
  currentPassword?: string;
  newPassword?: string;
};

const AccountEditSchema = Yup.object().shape({
  username: Yup.string()
    .required(ErrorMessages.REQUIRED_USERNAME)
    .test('alphanumericWithUnderScore', ErrorMessages.INVALID_USERNAME_FORMAT, function(value) {
      const ALPHANUMERIC_UNDERSCORE = /^[A-Za-z][A-Za-z0-9]*(?:_[A-Za-z0-9]+)*$/; // starts with alpha and contain numbers, underscores.
      return ALPHANUMERIC_UNDERSCORE.test(value || '');
    }),
  currentPassword: Yup.string().min(Defaults.MINIMUM_PASSWORD_LENGTH, ErrorMessages.INVALID_PASSWORD_LENGTH),
  newPassword: Yup.string().min(Defaults.MINIMUM_PASSWORD_LENGTH, ErrorMessages.INVALID_NEW_PASSWORD_LENGTH)
});

const Spinner = styled(CircularProgress)`
  color: white;
  margin-right: 4px;
`;

const FormContainer = styled(Form)`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const StyledTextField = styled(TextField)`
  flex: 1;
  align-self: stretch;
`;

const SaveFormButton = styled(Button)<ButtonProps>`
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 22px;
  max-width: 284px;
`;

const BottomContainer = styled.div`
  margin-top: 16px;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

function AccountEdit(props: AccountEditProps) {
  const [user] = useUser();
  const { match } = props;
  const userId = match.params.id;
  const getUser = useGetUser(userId);
  const { get } = getUser;
  const { data, error, isLoading, update } = useUpdateUser(userId);
  const [visiblePW, setVisiblePW] = useState(false);
  const [visibleNewPW, setVisibleNewPW] = useState(false);

  let initialValues;
  let ready = false;

  useEffect(() => {
    if (userId) {
      get();
    }
  }, [get, userId]);

  useEffect(() => {
    if (data && !error && !isLoading) {
      CmsSnackbarQueue.notify({
        dismissesOnAction: true,
        title: `${data.username} saved successfully.`,
        actions: [
          {
            label: 'DISMISS'
          }
        ]
      });
    } else if (error && !isLoading) {
      CmsSnackbarQueue.notify({
        dismissesOnAction: true,
        title: error.message,
        actions: [
          {
            label: 'DISMISS'
          }
        ]
      });
    }
  }, [data, error, isLoading]);

  const handleSubmit = async (values: AccountFormType, actions: FormikActions<AccountFormType>) => {
    actions.setSubmitting(true);
    if (user) {
      let userObj: UserUpdateDTO = {
        username: values.username,
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      };
      await update(userObj);
      actions.setFieldValue('currentPassword', '');
      actions.setFieldValue('newPassword', '');
    }
    actions.setSubmitting(false);
  };

  if (getUser.data) {
    const { username } = getUser.data;
    initialValues = { username };
    ready = true;
  }

  return (
    <Layout variant='centeredColumn' hidePatternFooter>
      <Box my={120} maxWidth={450} minWidth={387} width='26vw'>
        <Text variant='title' mb={35}>
          Account
        </Text>
        {ready && initialValues && (
          <Formik initialValues={initialValues} validationSchema={AccountEditSchema} validateOnBlur={true} onSubmit={handleSubmit}>
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <FormContainer>
                <FormField label='Username' validationMsg={touched.username && errors.username ? errors.username : ''}>
                  <StyledTextField
                    name='username'
                    rootProps={{ autoComplete: 'false' }}
                    outlined
                    type='text'
                    floatLabel={false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                  />
                </FormField>
                <FormField
                  label='Current Password'
                  validationMsg={touched.currentPassword && errors.currentPassword ? errors.currentPassword : ''}
                >
                  <StyledTextField
                    name='currentPassword'
                    rootProps={{ autoComplete: 'false' }}
                    outlined
                    type={visiblePW ? 'text' : 'password'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.currentPassword || ''}
                    trailingIcon={{
                      icon: visiblePW ? 'visibility' : 'visibility_off',
                      style: { outline: 'none' },
                      tabIndex: 0,
                      onMouseDown: () => setVisiblePW(true),
                      onMouseUp: () => setVisiblePW(false)
                    }}
                  />
                </FormField>
                <FormField label='New Password' validationMsg={touched.newPassword && errors.newPassword ? errors.newPassword : ''}>
                  <StyledTextField
                    name='newPassword'
                    rootProps={{ autoComplete: 'false' }}
                    outlined
                    type={visibleNewPW ? 'text' : 'password'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.newPassword || ''}
                    trailingIcon={{
                      icon: visibleNewPW ? 'visibility' : 'visibility_off',
                      style: { outline: 'none' },
                      tabIndex: 0,
                      onMouseDown: () => setVisibleNewPW(true),
                      onMouseUp: () => setVisibleNewPW(false)
                    }}
                  />
                </FormField>
                <BottomContainer>
                  <SaveFormButton variant='primary' type='submit' disabled={isSubmitting}>
                    {isSubmitting ? <Spinner /> : null}
                    Save
                  </SaveFormButton>
                </BottomContainer>
              </FormContainer>
            )}
          </Formik>
        )}
      </Box>
    </Layout>
  );
}

export default withRouter(AccountEdit);
