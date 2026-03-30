/**
 * Standardizes the success response for Server Actions
 * @param {any} data - The payload to return
 * @param {string} message - Optional success message
 * @returns {Object} Consistent format { success: true, data, message }
 */
export const actionSuccess = (data = null, message = '') => {
  const response = { success: true };
  if (data !== null && data !== undefined) response.data = data;
  if (message) response.message = message;

  return response;
};

/**
 * Standardizes the error response for Server Actions
 * @param {Error|string} error - The error object or string
 * @param {number} statusCode - Optional HTTP status code equivalent
 * @returns {Object} Consistent format { success: false, error: "error message", statusCode }
 */
export const actionError = (error, statusCode = 500) => {
  return {
    success: false,
    error: error instanceof Error ? error.message : typeof error === 'string' ? error : 'An unexpected error occurred',
    statusCode,
  };
};

/**
 * A wrapper to execute an async function and return standard action responses automatically.
 * Useful for reducing try-catch boilerplate in server actions.
 * @param {Function} asyncFunction - The async function to execute
 * @returns {Promise<Object>} The standardized response
 */
export const withActionResponse = async (asyncFunction) => {
  try {
    const data = await asyncFunction();
    return actionSuccess(data);
  } catch (error) {
    return actionError(error);
  }
};
