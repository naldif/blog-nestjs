import { Response } from 'express';

export const sendResponse = (
    res: Response,
    statusCode: number,
    status: 'success' | 'error',
    message: string,
    data: any = null,
    meta: any = null, // Metadata (e.g., pagination)
) => {
    res.status(statusCode).json({
        status,
        message,
        data,
        meta,
    });
};