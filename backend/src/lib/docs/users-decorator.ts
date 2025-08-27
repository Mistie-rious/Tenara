// src/users/decorators/users-swagger.decorator.ts
import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const CreateUserSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new user in the tenant' }),
    ApiCreatedResponse({ description: 'User created successfully' }),
    ApiBadRequestResponse({ description: 'Invalid input data' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Only admins can create users' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );

export const FindAllUsersSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all users in the tenant' }),
    ApiOkResponse({ description: 'Users retrieved successfully' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );
