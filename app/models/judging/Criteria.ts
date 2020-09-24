import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { JudgingToCriteria } from './JudgingToCriteria';

@Entity()
export class Criteria extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    maxScore!: number;

    @OneToMany(() => JudgingToCriteria, judgingToCriteria => judgingToCriteria.criteria)
    judgingToCriterias!: JudgingToCriteria[];

}
