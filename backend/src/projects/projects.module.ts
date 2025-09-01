import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TenantModule } from 'src/tenant/tenant.module';
@Module({
  imports: [TenantModule],
  providers: [ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule {}
