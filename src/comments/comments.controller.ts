import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { CommentResponseDTO } from './comment-response.dto';
import { CreateCommentDTO } from './comment-create.dto';
import { FindCommentsQueryDTO } from './find-comments-query.dto';
import { FindCommentsResponseDTO } from './find-comments-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDTO,
    @Param('postId') postId: string,
    @UserId() userId: number,
  ): Promise<CommentResponseDTO> {
    return await this.commentsService.create(createCommentDto, postId, userId);
  }

  @Get()
  async findAll(
    @Param('postId') postId: string,
    @Query() query: FindCommentsQueryDTO,
  ): Promise<FindCommentsResponseDTO> {
    const { limit, offset, search, withPostData, withUserData } = query;

    const comments = await this.commentsService.findAll(
      limit,
      offset,
      postId,
      undefined,
      search,
      withUserData,
      withPostData,
    );

    return {
      limit,
      offset,
      search,
      withUserData,
      withPostData,
      data: comments.map((comment) => {
        if (withUserData) {
          delete comment.user.password;
        }
        return comment;
      }),
    };
  }
}
