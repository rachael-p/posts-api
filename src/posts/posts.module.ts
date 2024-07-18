import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { Post } from './post.entity'; 
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
  ], 
  providers: [PostsService, ],
  controllers: [PostsController],
})
export class PostsModule {}
