import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDTO {
  @IsString()
  @IsNotEmpty({ message: "Content cannot be empty" })
  content: string;
}
