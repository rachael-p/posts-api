import { IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class CreateUserDTO {
  @IsString()
  @MinLength(4, { message: "Username is too short" })
  @MaxLength(20, { message: "Username is too long" })
  username: string;

  @IsString()
  @MinLength(8, { message: "Password is too short" })
  password: string;

  @IsString()
  @MinLength(3, { message: "Display name is too short" })
  @MaxLength(30, { message: "Display name is too long" })
  displayName: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
