// src/auth/dto/auth.dto.ts
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ description: 'Tenant name', example: 'Acme Corp' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User name', example: 'raindrops' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'First admin email', example: 'admin@acme.com' })
  @IsEmail()
  email: string;


  @ApiProperty({ description: 'First admin password', example: 'securePass123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({ description: 'User email', example: 'user@tenant.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'securePass123' })
  @IsNotEmpty()
  password: string;
}
