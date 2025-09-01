import { Injectable, ExecutionContext, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new BadRequestException('Authentication failed');
    }

    
    if (!user.tenantId) {
      throw new BadRequestException('Tenant ID missing from token');
    }

    const request = context.switchToHttp().getRequest();
    request['tenantId'] = user.tenantId;
    
  
    return user;
  }
}