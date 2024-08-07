import { CommentResponseDTO } from "./comment-response.dto";

export class FindCommentsResponseDTO {
  limit: number;
  offset: number;
  search?: string;
  withPostData?: boolean;
  withUserData?: boolean;
  data: CommentResponseDTO[];
}
