export interface ErrorResponse {
  error: {
    statusCode: number;
    message: string;
    errorName: string;
    details: {
      statusCode: number;
      message: string;
    }
  };
  path: string;
  requestId: string;
  timestamp: string;
}
