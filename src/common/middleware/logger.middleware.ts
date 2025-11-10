import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  correlationId: string;
}
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: CustomRequest, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const correlationId = req['correlationId'];
    const startTime = Date.now();

    // Log request
    this.logger.log(
      `[${correlationId}] ${method} ${originalUrl} - Request started`,
    );

    // Log response when finished
    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      this.logger.log(
        `[${correlationId}] ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
