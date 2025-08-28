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
@ApiTags('projects')
@ApiBearerAuth('access-token') 
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  @FindAllProjectsSwagger()
  findAll(@GetUser() user: any) {
    return this.projectsService.findAll(user.tenantId);
  }
  
  

  @Get(':id')

  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.projectsService.findOne(id, user.tenantId);
  }

  @Post()
  @CreateProjectSwagger()
  create(@Body() dto: CreateProjectDto, @GetUser() user: any) {
    return this.projectsService.create(dto, user.tenantId, user.id);
  }

  @Patch(':id')
@Roles(Role.ADMIN)
update(
  @Param('id') id: string,
  @Body() dto: UpdateProjectDto,
  @GetUser() user: any
) {
  return this.projectsService.update(id, user.tenantId, user.id, dto);
}

  @Delete(':id')
  @Roles(Role.ADMIN)
  @DeleteProjectSwagger()
  delete(@Param('id') id: string, @GetUser() user: any) {
    return this.projectsService.delete(id, user.tenantId, user.role);
  }


  @Post(':id/assign-users')
  @Roles(Role.ADMIN)
  assignUsersToProject(
    @Param('id') projectId: string,
    @Body('userIds') userIds: string[],
    @GetUser() user: any,
  ) {
    return this.projectsService.assignUserToProject(projectId, userIds, user.tenantId);
  }
  
   
    @Delete(':id/unassign-user/:userId')
    @Roles(Role.ADMIN)
    unassignUserFromProject(
      @Param('id') projectId: string,
      @Param('userId') userId: string,
      @GetUser() user: any,
    ) {
      return this.projectsService.unassignUserFromProject(projectId, userId, user.tenantId);
    }
}
