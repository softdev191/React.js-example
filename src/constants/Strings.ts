export enum ErrorMessages {
  INVALID_CREDENTIALS = 'The email and password do not match. Please check again.',
  NETWORK_ERROR = 'There is a network issue. Please try again later.',
  LOGOUT_ERROR = 'An error occured when trying to logout. Please try again.',
  ACCOUNT_UPDATE_ERROR = 'There was an error updating your account.',
  PERMISSION_REQUIRED = 'Permission required',
  PERMISSIONS_REQUIRED = 'Permissions required',
  INVALID_SESSION = 'Please login again.',

  // Fields
  INVALID_EMAIL = 'Invalid email',
  REQUIRED_EMAIL = 'Email is required',
  REQUIRED_PASSWORD = 'Password is required',
  REQUIRED_USERNAME = 'Username is required',
  INVALID_PASSWORD_LENGTH = 'Password must be of minimum 8 characters in length',
  INVALID_NEW_PASSWORD_LENGTH = 'New Password must be of minimum 8 characters in length',
  INVALID_USERNAME_FORMAT = 'Username should start with a letter. Can contain numbers or underscores'
}

export enum AlertTitles {
  ACCOUNT_UPDATED = 'Account Updated',
  UNKOWN_ERROR = 'An error occured',
  INVALID_LOGIN = 'Invalid Login',
  CONFIRM_LOGOUT = 'Log Out',
  SUCCESS = 'Success',
  RESET_DETAILS_FAILED = 'Reset details failed',
  RESET_PASSWORD_FAILED = 'Reset password failed.',
  ACCOUNT_UPDATE_ERROR = 'Account Update Error',
  PERMISSIONS_ERROR = 'Permissions error'
}

export enum AlertMessages {
  LOGOUT = 'Are you sure you want to log out?'
}

export enum AlertButtons {
  LOGOUT_CONFIRM = 'Log Out'
}

export enum SuccessMessages {
  ACCOUNT_UPDATED_SUCCEEDED = 'Your account has been updated.'
}

export enum ResetPasswordStrings {
  RESET_PASSWORD_TITLE = 'Set your New Password',
  RESET_PASSWORD_DESCRIPTION = 'Enter details below to set a new password',
  RESET_PASSWORD_NEW_PASSWORD_LABEL = 'New Password',
  RESET_PASSWORD_CONFIRM_PASSWORD_LABEL = 'Confirm Password',
  RESET_PASSWORD_NEW_PASSWORD_ERROR_MESSAGE = 'New Password is required',
  RESET_PASSWORD_CONFIRM_PASSWORD_ERROR_MESSAGE = 'Confirm Password is required',
  RESET_PASSWORD_DOES_NOT_MATCH_ERROR_MESSAGE = "Password doesn't match"
}

export enum ButtonStrings {
  BUTTON_CONFIRM = 'Confirm'
}
