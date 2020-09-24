import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Judging } from './Judging';
import { Criteria } from './Criteria';

@Entity()
export class JudgingToCriteria extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    judgingId!: number;

    @ManyToOne(() => Judging, judging => judging.judgingToCriterias)
    judging!: Judging;

    @Column()
    criteriaId!: number;

    @ManyToOne(() => Criteria, criteria => criteria.judgingToCriterias)
    criteria!: Criteria;

    @Column()
    score!: number;

    @Column({ type: 'text' })
    comment!: string;
}
