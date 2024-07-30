import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class HttpResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((response) => {
          if ('data' in response) {
            return {
              statusCode: context.switchToHttp().getResponse().statusCode,
              message: 'Success',
              ...response,
            };
            // if data field is present, the interceptor spreads the existing response and adds statusCode and message
          }
  
          return {
            statusCode: context.switchToHttp().getResponse().statusCode,
            message: 'Success',
            data: response,
          };
          // if data field is not present, the interceptor wraps the response inside a data field and adds statusCode and message
        }),
      );
    }
  }
  