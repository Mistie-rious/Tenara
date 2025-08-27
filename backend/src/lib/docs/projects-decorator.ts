// src/projects/decorators/projects-swagger.decorator.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const CreateProjectSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new project in the tenant' }),
    ApiCreatedResponse({ description: 'Project created successfully' }),
    ApiBadRequestResponse({ description: 'Invalid input' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );

export const FindAllProjectsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all projects in the tenant' }),
    ApiOkResponse({ description: 'Projects retrieved successfully' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );

export const DeleteProjectSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a project (admin only)' }),
    ApiOkResponse({ description: 'Project deleted successfully' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Only admins can delete projects' }),
    ApiNotFoundResponse({ description: 'Project not found' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );
