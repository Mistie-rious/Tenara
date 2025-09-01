import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class TenantService {
  constructor(@Inject(REQUEST) private request: any) {}

  getTenantId(): string {
   
    return this.request.user?.tenantId ;
  }

  getUserId(): string {
    return this.request.user?.id;
  }
}
