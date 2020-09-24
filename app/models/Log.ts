import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum LOG_TYPE {
    General = 'General',
    User = 'User',
    Admin = 'Admin',
    Error = 'Error',
}

@Entity()
export class Log extends BaseEntity {

    static async createAndSave(text: string, type: LOG_TYPE, typeId?: number): Promise<void> {
        const log = new Log();
        log.text = text;
        log.type = type;

        if (typeId) {
            log.typeId = typeId;
        }

        await log.save();
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    text!: string;

    @Column({ type: 'enum', enum: LOG_TYPE, default: LOG_TYPE.General })
    type!: LOG_TYPE;

    @Column({ nullable: true })
    typeId?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
