import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PostsService } from 'src/posts/posts.service';
import { Post } from 'src/posts/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post])],
  providers: [CommentsService, PostsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
