import { PostResponseDTO } from "./post-response.dto";

export class FindPostsResponseDTO {
  limit: number;
  offset: number;
  search?: string;
  username?: string;
  withUserData?: boolean;
  data: PostResponseDTO[];
}
