import { Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { Comment } from "./comment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCommentDTO } from "./comment-create.dto";
import { PostsService } from "src/posts/posts.service";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    // The @InjectRepository() decorator is used to inject the Comment entity repository from TypeORM. 
    // This allows us to access the methods provided by the repository, such as querying the database for comments.
    private readonly commentRepository: Repository<Comment>,
    private readonly postsService: PostsService,
  ) {}

  // Creates a new instance of the Comment entity and saves it to the database.
  // Returns the newly created comment.
  async create(
    createCommentDto: CreateCommentDTO,
    postId: string,
    userId: number,
  ): Promise<Comment> {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      postId, // Associate the comment with a post
      userId, // Associate the comment with a user
    });

    // Increment the comment counter in the associated post
    await this.postsService.incrementCommentCounter(postId);

    return this.commentRepository.save(comment);
  }

  // Returns all comments that match the given criteria.
async findAll(
  limit: number,
  offset: number,
  postId?: string,
  userId?: number,
  search?: string,
  withUserData?: boolean,
  withPostData?: boolean,
): Promise<Comment[]> {
  const content = search ? ILike(`%${search}%`) : undefined;
  const relations = [];

  if (withUserData) {
    relations.push("user");
  }

  if (withPostData) {
    relations.push("post");
  }

  const comments = await this.commentRepository.find({
    take: limit,
    skip: offset,
    where: [
      {
        postId,
        userId,
        content,
      },
    ],
    order: {
      timestamp: "DESC",
    },
    relations,
  });

  // Note that the find operation of the repository is used instead of the createQueryBuilder method. 
  // While the createQueryBuilder method offers more flexibility and control for constructing complex queries, the find operation provides a simpler and more convenient way to fetch entities from the database.

  return comments;
}


  

}
