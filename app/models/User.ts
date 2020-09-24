import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, AfterLoad, OneToMany } from 'typeorm';
import { Role, ROLE } from './Role';
import { Submission } from './Submission';
import { Vote } from './Vote';

@Entity()
export class User extends BaseEntity {

    static findByOsuId(osuId: number): Promise<User | undefined> {
        return User.findOne({
            where: { osuId },
        });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    osuId!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    roleId!: number;

    @ManyToOne(() => Role, { nullable: false })
    role!: Role;

    @OneToMany(() => Submission, (submission) => submission.user)
    submissions!: Submission[];

    @OneToMany(() => Vote, (vote) => vote.user)
    votes!: Vote[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    isBasicUser!: boolean;
    isElevatedUser!: boolean;
    isRestricted!: boolean;
    isContestant!: boolean;
    isCaptain!: boolean;
    isJudge!: boolean;
    isStaff!: boolean;

    @AfterLoad()
    getVirtuals (): void {
        this.isStaff = this.roleId === ROLE.Staff;
        this.isJudge = this.roleId === ROLE.Judge || this.isStaff;
        this.isBasicUser = this.roleId === ROLE.BasicUser || this.isStaff;
        this.isRestricted = this.roleId === ROLE.Restricted;
    }

}
