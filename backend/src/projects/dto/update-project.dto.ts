import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ProjectStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
