import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Submission } from '../Submission';
import { User } from '../User';
import { JudgingToCriteria } from './JudgingToCriteria';

@Entity()
export class Judging extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    judgeId!: number;

    @ManyToOne(() => User, { nullable: false })
    judge!: User;

    @Column()
    submissionId!: number;

    @ManyToOne(() => Submission, (submission) => submission.judging, { nullable: false })
    submission!: Submission;

    @OneToMany(() => JudgingToCriteria, judgingToCriteria => judgingToCriteria.judging)
    judgingToCriterias!: JudgingToCriteria[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
