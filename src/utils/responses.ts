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

export class ApiRes {
  constructor(
    public message: string,
    public data: object | null = null,
    public statusCode: number = 200
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}
