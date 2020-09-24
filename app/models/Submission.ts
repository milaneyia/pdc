import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Judging } from './judging/Judging';
import { User } from './User';
import { Song } from './Song';

@Entity()
export class Submission extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    anonymisedAs?: string;

    @Column()
    userId!: number;

    @ManyToOne(() => User, (user) => user.submissions, { nullable: false })
    user!: User;

    @Column()
    songId!: number;

    @ManyToOne(() => Song, (song) => song.submissions, { nullable: false })
    song!: Song;

    @OneToMany(() => Judging, (judging) => judging.submission)
    judging!: Judging[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
