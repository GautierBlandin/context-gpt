import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserInputDto {
  email: string;
  password: string;
}

export class LoginUserInputDto {
  email: string;
  password: string;
}

export class LoginUserOutputDto {
  token: string;
}

export class ErrorResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}
