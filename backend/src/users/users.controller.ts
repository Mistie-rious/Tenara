
import { Controller, Get, Post, Body, Req, UseGuards, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateUserSwagger, FindAllUsersSwagger } from 'src/lib/docs/users-decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { Tenant } from 'src/common/decorators/get-tenant.decorator';
@ApiTags('users')
@ApiBearerAuth('access-token') 
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('findAll')
  @FindAllUsersSwagger()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
getProfile(@GetUser() user: any) {

  return this.usersService.getUserById(user.id);
}


  @Post('create')
  @Roles(Role.ADMIN)
  @CreateUserSwagger()
  create(@Body() dto: CreateUserDto, @GetUser() user:any, ) {
    return this.usersService.create(dto,  user.role);
  }

  @Post(':id/assign-project')
  @Roles(Role.ADMIN)
  assignProjectToUser(
    @Param('id') userId: string,
    @Body('projectId') projectId: string,
    @GetUser() user: any,
  
  ) {
    return this.usersService.assignProjectToUser(userId, projectId);
  }

 
  @Delete(':id/unassign-project/:projectId')
  @Roles(Role.ADMIN)
  unassignProjectFromUser(
    @Param('id') userId: string,
    @Param('projectId') projectId: string,
    @GetUser() user: any,
   
  ) {
    return this.usersService.unassignProjectFromUser(userId, projectId);
  }
}
