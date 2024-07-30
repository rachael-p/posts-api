import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './create-post.dto';
import { PostResponseDTO } from './post-response.dto';
import { UpdatePostDto } from './update-post.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserId } from 'src/decorators/user-id.decorator';
import { PostOwnershipGuard } from 'src/guards/post-owner.guard';
import { UserService } from 'src/user/user.service';
import { FindPostsQueryDTO } from './find-posts-query.dto';
import { FindPostsResponseDTO } from './find-posts-response.dto';
    

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UserService
  ) {}
  
  @Get()
    async findAll(
        @Query() query: FindPostsQueryDTO,
    ): Promise<FindPostsResponseDTO> {
      const { limit, offset, search, username, withUserData } = query;

      let userId: number | undefined;

      if (username) {
        const user = await this.userService.findOne(username);
        if (!user) {
          throw new NotFoundException(`User with username ${username} not found`);
        }
        userId = user.id;
      }

      const posts = await this.postsService.findAll(limit, offset, search, userId, withUserData);
      
      return {
        limit,
        offset, 
        search, 
        username,
        withUserData,
        data: posts.map((post) => {
          delete post.userId;
          if (post.user) {
            delete post.user.password;
          }
          return post as PostResponseDTO;
        }),
      };
    }

  @Get(':id')
    async findOne(@Param('id') id: string): Promise<PostResponseDTO> {
      const post = await this.postsService.findOne(id);
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      delete post.userId;
      return post;
    }

  @UseGuards(JwtAuthGuard)
  @Post()
    async create(@Body() createPostDto: CreatePostDto, @UserId() userId: number,): Promise<PostResponseDTO> {
      const post = await this.postsService.create(createPostDto, userId);
      delete post.userId;
      return post;
    }

  @UseGuards(JwtAuthGuard, PostOwnershipGuard)
  @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() updatePostDto: UpdatePostDto,
    ): Promise<PostResponseDTO> {
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
