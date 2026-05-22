/**
 * ApiResponse Class
 * Standardized API response format
 */
class ApiResponse {
  constructor(statusCode, data = null, message = 'Success', pagination = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (pagination) {
      this.pagination = pagination;
    }
  }

  toJSON() {
    const response = {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
    };

    if (this.data !== null && this.data !== undefined) {
      response.data = this.data;
    }

    if (this.pagination) {
      response.pagination = this.pagination;
    }

    return response;
  }
}

export default ApiResponse;
