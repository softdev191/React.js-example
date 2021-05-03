import * as jwt from 'jsonwebtoken';
import { useCallback, useEffect } from 'react';

import Defaults from '../../constants/Defaults';
import { ErrorMessages } from '../../constants/Strings';
import { AccessToken } from '../../types/AccessToken';
import { User, UserDto } from '../../types/User';
import useUser from '../user/useUser';
import { HttpMethod, HttpStatusCode, removeAccessToken, setAccessToken } from './Api';
import { useApiGet, useApiMutation } from './Api.hooks';

export function useGetCurrentUser() {
  const { data, response, isLoading, error, get } = useApiGet<User | null | undefined>(undefined, 'users/me');
  let errorMessage;
  let returnData = data;

  useEffect(() => {
    if (response && !response.ok) {
      if (response.status === HttpStatusCode.UNAUTHORIZED || response.status === HttpStatusCode.FORBIDDEN) {
        removeAccessToken();
      }
    }
  }, [response]);

  if (response && !response.ok) {
    errorMessage = ErrorMessages.INVALID_SESSION;
    returnData = null;
  }

  return { data: returnData, isLoading, error: error || errorMessage, get };
}

export type LogInDTO = {
  username: string;
  password: string;
};

export function useLogin() {
  const [user, setUser] = useUser();
  const { data, response, isLoading, error, mutate } = useApiMutation<AccessToken, LogInDTO>(null, HttpMethod.POST, 'users/login');

  useEffect(() => {
    if (response && response.ok && data) {
      setAccessToken(data.accessToken, data.refreshToken);
      const message: any = jwt.decode(data.accessToken);
      setUser({ id: message.sub, username: message.name, email: '', created: '', modified: '', roles: message.roles });
    }
  }, [response, data, setUser]);

  const doLogin = useCallback(
    async (username: string, password: string) => {
      await mutate({ username, password });
    },
    [mutate]
  );

  return { data: data && user, isLoading, error, doLogin };
}

export function useLogout() {
  const [, setUser] = useUser();
  const { response, isLoading, error, mutate } = useApiMutation(null, HttpMethod.POST, 'users/logout');

  useEffect(() => {
    if (response && response.ok) {
      removeAccessToken();
      setUser(null);
    }
  }, [response, setUser]);

  const doLogout = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return { isLoading, error, doLogout };
}

// Example of the most simple implementation
export function useGetUser(userId: string) {
  return useApiGet<User | null>(null, 'users/' + userId);
}

// Example of a more typical implementation
export function useGetUsersByPage() {
  const { get: originalGet, ...rest } = useApiGet<UserDto[]>([], 'users/');

  const get = useCallback(
    async (params: { page?: number; query?: string; sort?: string; limit?: number }) => {
      const defaults = {
        page: 0,
        limit: Defaults.LIST_PAGE_SIZE
      };
      await originalGet({ ...defaults, ...params });
    },
    [originalGet]
  );

  return { ...rest, get };
}

export function useGetUsersCount() {
  return useApiGet<number | null>(null, 'users/count');
}

export type UserUpdateDTO = {
  username: string;
  currentPassword?: string;
  newPassword?: string;
};

export function useUpdateUser(userId: string) {
  const { mutate, ...rest } = useApiMutation<User, UserUpdateDTO>(null, HttpMethod.PATCH, 'users/' + userId);

  const update = useCallback(
    async (user: UserUpdateDTO) => {
      await mutate(user);
    },
    [mutate]
  );

  return { ...rest, update };
}

export type UserCreateDTO = {
  username: string;
  email: string;
  password: string;
};

export function useCreateUser() {
  const { mutate, ...rest } = useApiMutation<User, UserCreateDTO>(null, HttpMethod.POST, 'users/register');

  const create = useCallback(
    async (user: UserCreateDTO) => {
      await mutate(user);
    },
    [mutate]
  );

  return { ...rest, create };
}

export function useDeleteUser(userId: string) {
  const { mutate, ...rest } = useApiMutation<User, null>(null, HttpMethod.DELETE, 'users/' + userId);

  const userDelete = useCallback(async () => {
    await mutate();
  }, [mutate]);

  return { ...rest, userDelete };
}

export type RolesDTO = {
  id: number;
  name: string;
};

export function useGetAllRoles() {
  return useApiGet<RolesDTO[] | null>([], 'roles');
}
