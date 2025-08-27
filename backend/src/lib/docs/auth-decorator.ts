import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const CreateTenantSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a tenant and first admin user' }),
    ApiCreatedResponse({ description: 'Tenant and admin created successfully.' }),
    ApiBadRequestResponse({ description: 'Invalid request body.' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized.' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error.' }),
  );

export const LoginSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Login user' }),
    ApiOkResponse({ description: 'User logged in successfully.' }),
    ApiBadRequestResponse({ description: 'Invalid request body.' }),
    ApiUnauthorizedResponse({ description: 'Invalid credentials.' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error.' }),
  );
