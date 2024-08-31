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
