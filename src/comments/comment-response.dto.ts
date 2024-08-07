import { User } from "src/user/user.entity";

export class CommentResponseDTO {
  id: string;
  content: string;
  timestamp: Date;
  userId: number;
  postId: string;
  user?: User;
}
