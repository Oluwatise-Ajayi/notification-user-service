import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ClsService } from 'nestjs-cls';

interface CustomRequest extends Request {
  correlationId: string;
}

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly clsService: ClsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const correlationId =
      (req.headers['x-correlation-id'] as string | undefined) ?? uuidv4();

    (req as CustomRequest).correlationId = correlationId;
    res.setHeader('x-correlation-id', correlationId);

    this.clsService.set('correlationId', correlationId);
    next();
  }
}
