import { Controller } from '@nestjs/common';
import { CreateTenantSwagger, LoginSwagger } from 'src/lib/docs/auth-decorator';
import { Post, Body } from '@nestjs/common';
import { CreateTenantDto, LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth')
@Controller('auth')
export class AuthController {
    constructor(private service: AuthService) {}


@Post('create-tenant')
@CreateTenantSwagger()
createTenant(@Body() dto: CreateTenantDto) {
  return this.service.createTenant(dto);
}

@Post('login')
@LoginSwagger()
login(@Body() dto: LoginDto) {
  return this.service.login(dto);
}

}

