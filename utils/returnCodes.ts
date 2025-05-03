export const errorCodes: { [key: number]: string } = {
  11000:
    'Duplicate key error: There is already an account with that information.',

  121: 'Document validation failed: Please check your input.',

  66: 'Operation not allowed: This operation is not permitted on a capped collection.',

  13436:
    'Operation failed: The operation cannot be performed on a non-existent collection.',

  100: 'Cursor not found: The specified cursor does not exist.',

  20: 'Not master: The operation cannot be performed because this node is not the primary.',

  28: 'Database not found: The specified database does not exist.',

  29: 'Collection not found: Check the collection name and ensure it is correct.',

  125: 'Command not found: The specified command does not exist.',

  167: 'Write error: An error occurred during the write operation.',

  16500: 'Write conflict: You may need to retry the operation.',
};

export const messages: { [key: string]: string } = {
  requiredFields: 'Please fill the required fields!',
  loginSuccessful: 'Login successful! Welcome back.',
  wrongPassword: 'Wrong password! Please try again.',
  userNotFound: 'User not found! Please check your credentials.',
  accountDeleted: 'User successfully deleted!',
  accountLocked:
    'Your account is locked due to multiple failed login attempts. Please contact support.',
  registrationSuccessful: 'Registration successful! You can now log in.',
  emailAlreadyExists:
    'This email is already registered. Please use a different email.',
  passwordTooWeak: 'Your password is too weak! Please use a stronger password.',
  passwordMismatch: 'Passwords do not match! Please try again.',
  sessionExpired: 'Your session has expired. Please log in again.',
  logoutSuccessful: 'You have been logged out successfully.',
  updateSuccessful: 'Your profile has been updated successfully.',
  updateFailed: 'Failed to update your profile. Please try again later.',
  invalidEmail: 'Please enter a valid email address.',
  operationFailed: 'The operation failed. Please try again later.',
  accessDenied:
    'Access denied! You do not have permission to perform this action.',
};
