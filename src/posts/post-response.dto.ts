import { UserResponseDTO } from "src/user/user-response.dto";

export class PostResponseDTO {
    id: string;
    content: string;
    timestamp: Date;
    image?: string;
    likeCount: number;
    commentCount: number;
    user?: UserResponseDTO;
  }
  