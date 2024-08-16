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

  async findOne(id: string, withUserData?: boolean): Promise<Post | null> {
    const relations = [];

    if (withUserData) {
      relations.push('user');
    }

    return this.postRepository.findOne({
      where: { id },
      relations,
    });
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

  async findAll(
    limit: number,
    offset: number,
    search?: string,
    userId?: number,
    withUserData?: boolean,
  ): Promise<Post[]> {
    const queryBuilder = this.postRepository.createQueryBuilder('posts');
    // posts in this case is an alias that you assign to the table you're querying and used to reference the table in different parts of the query

    if (withUserData) {
      queryBuilder.leftJoinAndSelect('posts.user', 'user');
      // left join is used to combine rows from two tables based on a related column and says that all rows from left table will be returned, even if there's no match in the right table (in this case all posts will be included even if no user)
    }

    let hasWhereCondition = false;

    if (search !== undefined) {
      queryBuilder.where('posts.content ILIKE :search', {
        search: `%${search}%`,
        // % symbols are used as wildcard characters to match any characters before and after the search query
      });
      hasWhereCondition = true;
    }

    if (userId !== undefined) {
      if (hasWhereCondition) {
        queryBuilder.andWhere('posts.userId = :userId', { userId });
      } else {
        queryBuilder.where('posts.userId = :userId', { userId });
        hasWhereCondition = true;
      }
    }

    queryBuilder.limit(limit);
    queryBuilder.offset(offset);

    queryBuilder.orderBy('posts.timestamp', 'DESC');

    return await queryBuilder.getMany();
  }

  async incrementCommentCounter(id: string): Promise<Post | null> {
    const post = await this.findOne(id);
    if (!post) {
      return null;
    }

    post.commentCount += 1;
    await this.postRepository.save(post);
    return post;
  }
  // We'll add methods for handling CRUD operations here
}
