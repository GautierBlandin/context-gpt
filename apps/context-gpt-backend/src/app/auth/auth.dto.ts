import { IsNotEmpty } from 'class-validator';

export class CheckTokenInputDto {
  @IsNotEmpty()
  token: string;
}

export class CheckTokenOutputDto {
  @IsNotEmpty()
  isValid: boolean;
}
