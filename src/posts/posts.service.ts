import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: number): Promise<Post> {
    const post = await this.postRepository.create({
      ...createPostDto,
      userId,
    });
    return this.postRepository.save(post);
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postRepository.findOneBy({ id });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    const post = await this.postRepository.preload({ id, ...updatePostDto });
    // The preload method creates a new entity based on the object passed, where the id is required for TypeORM to determine which entity to load from the database. It then merges the provided updatePostDto with the found entity. If the entity does not exist in the database, preload returns undefined, and we return null.
    if (!post) {
      return null;
    }
    return this.postRepository.save(post);
    // The save operation will update the entity if it already exists in the database (otherwise it will add the entity to the database).
  }

  async remove(id: string): Promise<Post | null> {
    const post = await this.findOne(id);
    if (!post) {
      return null;
    }
    return this.postRepository.remove(post);
  }  
  
  async findAll(limit: number, offset: number): Promise<Post[]> {
    const queryBuilder = this.postRepository.createQueryBuilder('posts');
        // posts in this case is an alias that you assign to the table you're querying and used to reference the table in different parts of the query
    queryBuilder.limit(limit);
    queryBuilder.offset(offset);
    return await queryBuilder.getMany();
  }
  
  
  

  // We'll add methods for handling CRUD operations here
}
