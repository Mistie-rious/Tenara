// src/tenant/tenant.module.ts
import { Module } from '@nestjs/common';
import { TenantService } from 'src/common/guards/tenant-context.service';
@Module({
  providers: [TenantService],
  exports: [TenantService],  
})
export class TenantModule {}
