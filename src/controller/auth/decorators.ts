import { RefreshTokenDto, SignInDto, SignUpDto, UserResponseDto } from '@/dto';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';

export const SwaggerSignInDocs = () =>
  applyDecorators(
    ApiBody({ type: SignInDto }),
    ApiResponse({ status: HttpStatus.OK, description: 'User successfully authenticated', type: UserResponseDto }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Too many requests',
    }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' }),
  );

export const SwaggerSignUpDocs = () =>
  applyDecorators(
    ApiBody({ type: SignUpDto }),
    ApiResponse({ status: HttpStatus.CREATED, description: 'User successfully created', type: UserResponseDto }),
    ApiResponse({ status: HttpStatus.CONFLICT, description: 'User already exists' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' }),
  );

export const SwaggerRefreshDocs = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiBody({ type: RefreshTokenDto }),
    ApiResponse({ status: HttpStatus.OK, description: 'Tokens successfully refreshed', type: UserResponseDto }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid refresh token' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' }),
  );

export const SwaggerLogOutDocs = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiResponse({ status: HttpStatus.OK, description: 'Logout successful', schema: { type: 'null' } }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid token' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal server error' }),
  );
