// src/tenant/tenant-context.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { TenantContext } from './tenant-context.service';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class TenantContextInterceptor implements NestInterceptor {
    constructor(private readonly tenantContext: TenantContext) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
  
      if (request.user?.tenantId) {
        this.tenantContext.setTenant(request.user.tenantId);
      }
  
      return next.handle();
    }
  }
  