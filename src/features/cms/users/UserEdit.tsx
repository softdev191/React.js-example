import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { Button, ButtonProps } from '@rmwc/button';
import { Card } from '@rmwc/card';
import { CircularProgress } from '@rmwc/circular-progress';
import { SimpleDialog } from '@rmwc/dialog';
import { Typography } from '@rmwc/typography';

import { Form, Formik, FormikHelpers as FormikActions } from 'formik';
import * as Yup from 'yup';

import { ErrorMessages } from '../../../constants/Strings';
import TextField from '../../../components/TextField';
import SelectField from '../../../components/SelectField';
import { useGetUser, useUpdateUser, useCreateUser, useDeleteUser, useGetAllRoles, RolesDTO } from '../../../lib/api/User.hooks';
import CmsSnackbarQueue from '../../../lib/CmsSnackbarQueue';
import styled from '../../../styled-components';
import theme from '../../../constants/Theme';

type UserEditProps = RouteComponentProps<{ id: string }>;
type UserFormType = {
  id: number | string;
  username: string;
  email: string;
  password?: string;
  roles?: RolesDTO[];
};

const UserEditSchema = Yup.object().shape({
  email: Yup.string()
    .email(ErrorMessages.INVALID_EMAIL)
    .required(ErrorMessages.REQUIRED_EMAIL),
  username: Yup.string().required(ErrorMessages.REQUIRED_USERNAME)
});

const UserCreateSchema = Yup.object().shape({
  email: Yup.string()
    .email(ErrorMessages.INVALID_EMAIL)
    .required(ErrorMessages.REQUIRED_EMAIL),
  username: Yup.string().required(ErrorMessages.REQUIRED_USERNAME),
  password: Yup.string().required(ErrorMessages.REQUIRED_PASSWORD)
});

const Container = styled.div`
  padding: 20px;
  background-color: #eee;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  margin: 8px 0;
  justify-content: space-between;
`;

const StyledCard = styled(Card)`
  display: flex;
`;

const Spinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`;

const FormContainer = styled(Form)`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
`;

const StyledTextField = styled(TextField)`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: fex;
  justify-content: space-between;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-start;

  & > * {
    margin: 5px;
  }
`;

const DeleteButton = styled(Button)<ButtonProps & { type: string; onClick: () => void }>`
  &&& {
    color: ${theme.destructiveColor};
  }
`;

const SelectContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
`;

function UserEdit(props: UserEditProps) {
  const { history, match } = props;
  const userId = match.params.id;
  const getUser = useGetUser(userId);
  const updateUser = useUpdateUser(userId);
  const { get } = getUser;
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser(userId);
  const { get: getAllRoles, data } = useGetAllRoles();
  const [dialog, setDialog] = useState(false);

  useEffect(() => {
    if (userId !== 'new') {
      get();
    }
  }, [get, userId]);

  useEffect(() => {
    getAllRoles();
  }, [getAllRoles]);

  useEffect(() => {
    if (updateUser.data && !updateUser.error && !updateUser.isLoading) {
      CmsSnackbarQueue.notify({
        title: `${updateUser.data.username} saved successfully.`,
        actions: [
          {
            label: 'VIEW',
            onClick: () => history.push('/cms/users/' + updateUser.data!.id)
          }
        ]
      });

      // TODO this causes a warning. Fix warning.
      history.push('/cms/users');
    } else if (createUser.data && !createUser.error && !createUser.isLoading) {
      CmsSnackbarQueue.notify({
        title: `${createUser.data.username} created successfully.`,
        actions: [
          {
            label: 'VIEW',
            onClick: () => history.push('/cms/users/' + createUser.data!.id)
          }
        ]
      });
      history.push('/cms/users');
    } else if (deleteUser.data && !deleteUser.error && !deleteUser.isLoading) {
      CmsSnackbarQueue.notify({
        title: `${deleteUser.data.username} deleted successfully.`
      });
      history.push('/cms/users');
    }
  }, [
    history,
    updateUser.data,
    updateUser.error,
    updateUser.isLoading,
    createUser.data,
    createUser.error,
    createUser.isLoading,
    deleteUser.data,
    deleteUser.error,
    deleteUser.isLoading
  ]);

  const handleSubmit = async (values: UserFormType, actions: FormikActions<UserFormType>) => {
    actions.setSubmitting(true);
    if (userId === 'new') {
      let newUser = {
        username: values.username,
        email: values.email,
        password: values.password!,
        roles: values.roles
      };
      await createUser.create(newUser);
    } else {
      const userObj = {
        username: values.username,
        email: values.email,
        roles: values.roles
      };
      await updateUser.update(userObj);
    }
    actions.setSubmitting(false);
  };

  const handleDelete = async () => {
    await deleteUser.userDelete();
    history.goBack();
  };

  const handleCancel = () => {
    history.goBack();
  };

  let initialValues;
  let ready = false;

  if (userId === 'new') {
    initialValues = { id: 'new', username: '', email: '', password: '' };
    ready = true;
  } else {
    initialValues = getUser.data;
    ready = !getUser.isLoading;
  }

  return (
    <Container>
      <TopBar>
        <Typography use='headline5'>User</Typography>
      </TopBar>
      <StyledCard>
        {!ready && (
          <Spinner>
            <CircularProgress size='large' />
          </Spinner>
        )}
        {ready && initialValues && (
          <Formik
            initialValues={initialValues}
            validationSchema={userId !== 'new' ? UserEditSchema : UserCreateSchema}
            validateOnBlur={true}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting, setFieldValue }) => (
              <FormContainer>
                <StyledTextField outlined name='id' label='ID' value={values.id} disabled />
                <StyledTextField
                  outlined
                  type='text'
                  name='username'
                  label='Username'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  helpText={{ persistent: true, validationMsg: true, children: touched.username && errors.username }}
                />
                <StyledTextField
                  outlined
                  type='email'
                  name='email'
                  label='Email'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  helpText={{ persistent: true, validationMsg: true, children: touched.email && errors.email }}
                />
                {userId === 'new' && (
                  <StyledTextField
                    outlined
                    type='password'
                    name='password'
                    label='Password'
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    helpText={{ persistent: true, validationMsg: true, children: touched.password && errors.password }}
                  />
                )}
                <SelectContainer>
                  <SelectField
                    isMulti
                    label='Select Roles'
                    defaultValue={values.roles}
                    name='user-roles'
                    options={data}
                    onChange={(e: RolesDTO) => setFieldValue('roles', e)}
                    placeholder='Select roles'
                    changeOptionLabel='name'
                    changeOptionValue='id'
                  />
                </SelectContainer>
                <ButtonContainer>
                  <Buttons>
                    <Button
                      unelevated
                      type='submit'
                      label='Save'
                      disabled={isSubmitting}
                      icon={isSubmitting ? <CircularProgress /> : null}
                    />
                    <Button theme='secondary' label='Cancel' onClick={handleCancel} type='button' />
                  </Buttons>
                  {userId !== 'new' && <DeleteButton label='Delete' onClick={() => setDialog(true)} type='button' />}
                </ButtonContainer>
              </FormContainer>
            )}
          </Formik>
        )}
      </StyledCard>
      <SimpleDialog
        title='Delete User'
        body='Are you sure you want to delete this user?'
        open={dialog}
        onClose={async e => {
          if (e.detail.action === 'accept') {
            await handleDelete();
          }
          setDialog(false);
        }}
        acceptLabel='Delete'
      />
    </Container>
  );
}

export default withRouter(UserEdit);
