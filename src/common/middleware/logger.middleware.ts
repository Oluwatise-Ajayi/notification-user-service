import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  correlationId: string;
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const requestWithId = req as CustomRequest;
    const correlationId = requestWithId.correlationId;
    const { method, originalUrl } = requestWithId;
    const startTime = Date.now();

    this.logger.log(
      `[${correlationId}] ${method} ${originalUrl} - Request started`,
    );

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
