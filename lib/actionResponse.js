export const actionSuccess = (data = null, message = '') => {
  const response = { success: true };
  if (data !== null && data !== undefined) response.data = data;
  if (message) response.message = message;

  return response;
};

export const actionError = (error, statusCode = 500) => {
  return {
    success: false,
    error: error instanceof Error ? error.message : typeof error === 'string' ? error : 'An unexpected error occurred',
    statusCode,
  };
};
