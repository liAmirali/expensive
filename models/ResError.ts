export const ResError = (statusCode: number, message: string) => {
  return {
    statusCode,
    message,
  };
};
