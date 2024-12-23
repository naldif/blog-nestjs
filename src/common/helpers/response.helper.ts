/* eslint-disable prettier/prettier */
import { Response } from 'express';

export const sendResponse = (
  res: Response,
  statusCode: number,
  status: string,
  message: string,
  data?: any,
  error?: any
) => {
  const response = {
    status,
    message,
    data,
    error,
  };

  return res.status(statusCode).json(response);
};
