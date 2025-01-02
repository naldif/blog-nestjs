import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const errorResponse = exception.getResponse();

    // Menangani jika errorResponse.message berisi array dari ValidationError
    if (Array.isArray(errorResponse['message'])) {
      const formattedErrors = this.formatValidationErrors(errorResponse['message'] as ValidationError[]);
      return response.status(status).json({
        message: formattedErrors,
        error: 'Bad Request',
        statusCode: status,
      });
    }

    // Tangani kesalahan lainnya (untuk non-validasi)
    return response.status(status).json({
      message: errorResponse['message'] || 'Something went wrong',
      error: exception.constructor.name,
      statusCode: status,
    });
  }

  private formatValidationErrors(errors: ValidationError[]): any {
    // Pengecekan jika errors adalah array dan memiliki nilai
    if (!errors || errors.length === 0) {
      return {}; // Kembalikan objek kosong jika tidak ada error
    }
  
    const formattedErrors: any = {};
  
    errors.forEach((error) => {
      const property = error.property;
      
      // Pastikan property ada dan bukan undefined
      if (property) {
        if (!formattedErrors[property]) {
          formattedErrors[property] = [];
        }
        
        // Periksa apakah constraints ada sebelum mengaksesnya
        if (error.constraints) {
          Object.values(error.constraints).forEach((message) => {
            formattedErrors[property].push(message);
          });
        }
      }
    });
  
    return formattedErrors;
  }
  
}
