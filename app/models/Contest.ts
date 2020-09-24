import { BaseEntity, Column, CreateDateColumn, Entity, LessThanOrEqual, MoreThanOrEqual, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Song } from './Song';

@Entity()
export class Contest extends BaseEntity {

    static findForVoting(userId?: number): Promise<Contest | undefined> {
        const today = new Date();

        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs')
            .leftJoinAndSelect('songs.votes', 'votes', 'votes.userId = :userId', { userId })
            // .where({
            //     votingEndedAt: MoreThanOrEqual(today),
            //     votingStartedAt: LessThanOrEqual(today),
            // })
            .where('votingEndedAt >= :today', { today })
            .where('votingStartedAt <= :today', { today })
            .orderBy('songs.artist')
            .getOne();
    }

    static findForSubmissions(): Promise<Contest | undefined> {
        const today = new Date();

        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs', 'songs.wasChosen = true')
            .where({
                submissionsEndedAt: MoreThanOrEqual(today),
                submissionsStartedAt: LessThanOrEqual(today),
            })
            .getOne();
    }

    static findForJudging(): Promise<Contest | undefined> {
        const today = new Date();

        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs', 'songs.wasChosen = true')
            .where({
                judgingEndedAt: MoreThanOrEqual(today),
                judgingStartedAt: LessThanOrEqual(today),
            })
            .getOne();
    }

    static findLastJudgingContest(): Promise<Contest | undefined> {
        const today = new Date();

        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs', 'songs.wasChosen = true')
            .where({
                judgingEndedAt: LessThanOrEqual(today),
            })
            .orderBy({
                judgingEndedAt: 'DESC',
            })
            .getOne();
    }

    static findForResults(restricted = true): Promise<Contest | undefined> {
        if (restricted) {
            return this
                .createQueryBuilder('contest')
                .leftJoinAndSelect('contest.songs', 'songs', 'songs.wasChosen = true')
                .leftJoinAndSelect('songs.submissions', 'submissions', 'contest.resultsAt <= :today', { today: new Date() })
                .leftJoinAndSelect('submissions.judging', 'judging')
                .leftJoinAndSelect('judging.judge', 'judge')
                .leftJoinAndSelect('judging.judgingToCriterias', 'judgingToCriterias')
                .leftJoinAndSelect('judgingToCriterias.criteria', 'criteria')
                .getOne();
        }

        return this.findOne({
            relations: [
                'songs',
                'songs.submissions',
                'songs.submissions.judging',
                'songs.submissions.judging.judge',
                'songs.submissions.judging.judgingToCriterias',
                'songs.submissions.judging.judgingToCriterias.criteria',
            ],
        });
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    votingStartedAt!: Date;

    @Column()
    votingEndedAt!: Date;

    @Column()
    submissionsStartedAt!: Date;

    @Column()
    submissionsEndedAt!: Date;

    @Column()
    judgingStartedAt!: Date;

    @Column()
    judgingEndedAt!: Date;

    @Column()
    resultsAt!: Date;

    @OneToMany(() => Song, (song) => song.contest)
    songs!: Song[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
