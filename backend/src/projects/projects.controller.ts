import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards , Patch} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project-dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateProjectSwagger, FindAllProjectsSwagger, DeleteProjectSwagger } from '../lib/docs/projects-decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Tenant } from 'src/common/decorators/get-tenant.decorator';

@ApiTags('projects')
@ApiBearerAuth('access-token') 
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @FindAllProjectsSwagger()
  findAll(@Tenant() tenantId: string ) {
    return this.projectsService.findAll();
  }
  
  

  @Get(':id')

  findOne(@Param('id') id: string, @Tenant() tenantId: string) {
    return this.projectsService.findOne(id);
  }

  @Post()
  @CreateProjectSwagger()
  create(@Body() dto: CreateProjectDto, @GetUser() user: any, @Tenant() tenantId: string) {
    return this.projectsService.create(dto, user.id);
  }

  @Patch(':id')
@Roles(Role.ADMIN)
update(
  @Param('id') id: string,
  @Body() dto: UpdateProjectDto,
  @GetUser() user: any,
  @Tenant() tenantId: string
) {
  return this.projectsService.update(id,  user.id, dto);
}

  @Delete(':id')
  @Roles(Role.ADMIN)
  @DeleteProjectSwagger()
  delete(@Param('id') id: string, @GetUser() user: any, @Tenant() tenantId: string) {
    return this.projectsService.delete(id,  user.role);
  }


  @Post(':id/assign-users')
  @Roles(Role.ADMIN)
  assignUsersToProject(
    @Param('id') projectId: string,
    @Body('userIds') userIds: string[],
    @GetUser() user: any,
    @Tenant() tenantId: string
  ) {
    return this.projectsService.assignUserToProject(projectId, userIds);
  }
  
   
    @Delete(':id/unassign-user/:userId')
    @Roles(Role.ADMIN)
    unassignUserFromProject(
      @Param('id') projectId: string,
      @Param('userId') userId: string,
      @GetUser() user: any,
      @Tenant() tenantId: string
    ) {
      return this.projectsService.unassignUserFromProject(projectId, userId);
    }
}
