import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './Category';
import { Song } from './Song';

@Entity()
export class Contest extends BaseEntity {

    static findForVoting(userId?: number): Promise<Contest | undefined> {
        const today = new Date();

        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs')
            .leftJoinAndSelect('songs.votes', 'votes', 'votes.userId = :userId', { userId })
            .where('votingEndedAt >= :today', { today })
            .andWhere('votingStartedAt <= :today', { today })
            .orderBy('songs.artist')
            .getOne();
    }

    static findForVotingResults(isStaff: boolean | undefined): Promise<Contest | undefined> {
        const today = new Date();
        const query = this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs')
            .leftJoinAndSelect('songs.votes', 'votes')
            .orderBy('songs.artist');

        if (!isStaff) query.where('votingEndedAt < :today', { today });

        return query.getOne();
    }

    static findForSubmissions(): Promise<Contest | undefined> {
        const today = new Date();

        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs', 'songs.wasChosen = true')
            .leftJoinAndSelect('songs.category', 'category')
            .where('submissionsEndedAt >= :today', { today })
            .andWhere('submissionsStartedAt <= :today', { today })
            .getOne();
    }

    static findForJudging(): Promise<Contest | undefined> {
        const today = new Date();

        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.categories', 'categories')
            .leftJoinAndSelect('categories.songs', 'songs', 'songs.wasChosen = true')
            .where('judgingEndedAt >= :today', { today })
            .andWhere('judgingStartedAt <= :today', { today })
            .getOne();
    }

    static findLastJudgingContest(): Promise<Contest | undefined> {
        const today = new Date();

        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.categories', 'categories')
            .leftJoinAndSelect('categories.songs', 'songs', 'songs.wasChosen = true')
            .where('judgingEndedAt <= :today', { today })
            .orderBy({
                judgingEndedAt: 'DESC',
            })
            .getOne();
    }

    static findForResults(restricted = true): Promise<Contest | undefined> {
        if (restricted) {
            return this
                .createQueryBuilder('contest')
                .leftJoinAndSelect('contest.categories', 'categories')
                .leftJoinAndSelect('categories.songs', 'songs', 'songs.wasChosen = true')
                .leftJoinAndSelect('songs.submissions', 'submissions', 'contest.resultsAt <= :today', { today: new Date() })
                .leftJoinAndSelect('submissions.user', 'user')
                .leftJoinAndSelect('submissions.judging', 'judging')
                .leftJoinAndSelect('judging.judge', 'judge')
                .leftJoinAndSelect('judging.judgingToCriterias', 'judgingToCriterias')
                .leftJoinAndSelect('judgingToCriterias.criteria', 'criteria')
                .getOne();
        }

        return this.findOne({
            relations: [
                'categories',
                'categories.songs',
                'categories.songs.submissions',
                'categories.songs.submissions.user',
                'categories.songs.submissions.judging',
                'categories.songs.submissions.judging.judge',
                'categories.songs.submissions.judging.judgingToCriterias',
                'categories.songs.submissions.judging.judgingToCriterias.criteria',
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

    @OneToMany(() => Category, (category) => category.contest)
    categories!: Category[];

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}
