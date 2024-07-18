import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './create-post.dto';
import { PostResponseDto } from './post-response.dto';
import { UpdatePostDto } from './update-post.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { PostOwnershipGuard } from 'src/guards/post-owner.guard';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  
  @Get()
    async findAll(
        @Query('limit') limit: number,
        @Query('offset') offset: number,
    ): Promise<PostResponseDto[]> {
      const posts = await this.postsService.findAll(limit, offset);
      return posts.map((post) => {
        delete post.userId;
        return post;
      });
    }

  @Get(':id')
    async findOne(@Param('id') id: string): Promise<PostResponseDto> {
      const post = await this.postsService.findOne(id);
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      delete post.userId;
      return post;
    }

  @UseGuards(JwtAuthGuard)
  @Post()
    async create(@Body() createPostDto: CreatePostDto, @UserId() userId: number,): Promise<PostResponseDto> {
      const post = await this.postsService.create(createPostDto, userId);
      delete post.userId;
      return post;
    }

  @UseGuards(JwtAuthGuard, PostOwnershipGuard)
  @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() updatePostDto: UpdatePostDto,
    ): Promise<PostResponseDto> {
      const post = await this.postsService.update(id, updatePostDto);
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      delete post.userId;
      return post;
    }

  @UseGuards(JwtAuthGuard, PostOwnershipGuard)
  @Delete(':id')
    async remove(
      @Param('id') id: string,
    ): Promise<{ statusCode: number; message: string }> {
      const post = await this.postsService.remove(id);
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      return {
        statusCode: 200,
        message: 'Post deleted successfully',
      };
    }
    
    
    


  // We will add handlers for CRUD endpoints here
}
