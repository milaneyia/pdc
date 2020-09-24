import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ROLE {
    BasicUser = 1,
    Restricted = 2,
    Judge = 3,
    Staff = 4,
}

@Entity()
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    name!: string;

}
