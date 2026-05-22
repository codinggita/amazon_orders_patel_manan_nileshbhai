/**
 * ApiError Class
 * Custom error class for API error responses
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = null;
  }

  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
      data: this.data,
    };
  }
}

export default ApiError;
