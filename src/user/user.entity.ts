import { Post } from "src/posts/post.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  avatar: string;
  // specifying nullable is true means the avatar property is optional

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
