import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './Category';
import { Contest } from './Contest';
import { Submission } from './Submission';
import { Vote } from './Vote';

@Entity()
export class Song extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    artist!: string;

    @Column()
    title!: string;

    @Column()
    previewLink!: string;

    @Column({ default: false })
    isFa!: boolean;

    @Column({ default: false })
    wasChosen!: boolean;

    @Column()
    contestId!: number;

    @ManyToOne(() => Contest, (contest) => contest.songs, { nullable: false })
    contest!: Contest;

    @Column({ nullable: true })
    categoryId!: number;

    @ManyToOne(() => Category, (category) => category.songs)
    category!: Category;

    @OneToMany(() => Submission, (submission) => submission.song)
    submissions!: Submission[];

    @OneToMany(() => Vote, (vote) => vote.song)
    votes!: Vote[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
