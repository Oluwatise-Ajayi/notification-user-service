import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationMeta } from '../interfaces/paginated-response.interface';

export interface StandardResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
  meta?: PaginationMeta;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data: T) => {
        // If data is already in standard format, return it directly
        if (data && typeof data === 'object' && 'data' in data) {
          return data as unknown as StandardResponse<T>;
        }

        // Otherwise, wrap it in standard format
        return {
          success: true,
          data: data,
          message: 'Operation successful',
        };
      }),
    );
  }
}
