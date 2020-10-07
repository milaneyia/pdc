import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contest } from './Contest';
import { Song } from './Song';

@Entity()
export class Category extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    contestId!: number;

    @ManyToOne(() => Contest, (contest) => contest.categories, { nullable: false })
    contest!: Contest;

    @OneToMany(() => Song, (song) => song.category)
    songs!: Song[];

}
