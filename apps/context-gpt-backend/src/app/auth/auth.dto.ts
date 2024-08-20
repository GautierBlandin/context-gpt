import { IsNotEmpty } from 'class-validator';

export class GetAuthValidateOutputDto {
  @IsNotEmpty()
  is_valid: boolean;
}

export class PostAuthLoginInputDto {
  @IsNotEmpty()
  token: string;
}

export class PostAuthLoginDto {
  @IsNotEmpty()
  access_token: string;
}
