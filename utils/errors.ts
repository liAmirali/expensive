export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number = 500, data: any = null) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}
