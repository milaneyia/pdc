import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Song } from './Song';
import { User } from './User';

@Entity()
export class Vote extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    points!: number;

    @Column()
    userId!: number;

    @ManyToOne(() => User, (user) => user.votes, { nullable: false })
    user!: User;

    @Column()
    songId!: number;

    @ManyToOne(() => Song, (song) => song.votes, { nullable: false })
    song!: Song;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
