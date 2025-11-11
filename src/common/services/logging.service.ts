import { Injectable, Logger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger('NotificationLifecycle');

  constructor(private readonly clsService: ClsService) {}

  logWithCorrelation(message: string, context: Record<string, unknown> = {}) {
    const correlationId =
      this.clsService.get<string>('correlationId') ?? 'unknown';
    this.logger.log(
      JSON.stringify({
        correlation_id: correlationId,
        timestamp: new Date().toISOString(),
        message,
        ...context,
      }),
    );
  }
}
