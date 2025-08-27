import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

import { ProjectStatus } from '@prisma/client';


export class CreateProjectDto {
  @ApiProperty({ example: 'Website Redesign' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Redesign the company website', required: false })
  @IsOptional()
  description?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  @ApiProperty({ enum: ProjectStatus })
  status?: ProjectStatus;
}

