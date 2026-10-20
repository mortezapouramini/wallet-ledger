export interface ErrorBody {
  message: string;
  code: number;
  details?: string | object;
}
export interface ErrorResponse {
  success: false;
  body: ErrorBody;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}
