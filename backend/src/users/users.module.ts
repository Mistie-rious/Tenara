import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TenantModule } from 'src/tenant/tenant.module';
@Module({
  imports: [TenantModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
