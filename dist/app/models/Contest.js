"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contest = void 0;
const typeorm_1 = require("typeorm");
const Song_1 = require("./Song");
let Contest = class Contest extends typeorm_1.BaseEntity {
    static findForVoting(userId) {
        const today = new Date();
        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs')
            .leftJoinAndSelect('songs.votes', 'votes', 'votes.userId = :userId', { userId })
            .where('votingEndedAt >= :today', { today })
            .andWhere('votingStartedAt <= :today', { today })
            .orderBy('songs.artist')
            .getOne();
    }
    static findForVotingResults(isStaff) {
        const today = new Date();
        const query = this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs')
            .leftJoinAndSelect('songs.votes', 'votes')
            .orderBy('songs.artist');
        if (!isStaff)
            query.where('votingEndedAt < :today', { today });
        return query.getOne();
    }
    static findForSubmissions() {
        const today = new Date();
        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs', 'songs.wasChosen = true')
            .where('submissionsEndedAt >= :today', { today })
            .andWhere('submissionsStartedAt <= :today', { today })
            .getOne();
    }
    static findForJudging() {
        const today = new Date();
        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs', 'songs.wasChosen = true')
            .where('judgingEndedAt >= :today', { today })
            .andWhere('judgingStartedAt <= :today', { today })
            .getOne();
    }
    static findLastJudgingContest() {
        const today = new Date();
        return this.createQueryBuilder('contest')
            .leftJoinAndSelect('contest.songs', 'songs', 'songs.wasChosen = true')
            .where('judgingEndedAt <= :today', { today })
            .orderBy({
            judgingEndedAt: 'DESC',
        })
            .getOne();
    }
    static findForResults(restricted = true) {
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
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Contest.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Contest.prototype, "votingStartedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Contest.prototype, "votingEndedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Contest.prototype, "submissionsStartedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Contest.prototype, "submissionsEndedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Contest.prototype, "judgingStartedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Contest.prototype, "judgingEndedAt", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], Contest.prototype, "resultsAt", void 0);
__decorate([
    typeorm_1.OneToMany(() => Song_1.Song, (song) => song.contest),
    __metadata("design:type", Array)
], Contest.prototype, "songs", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Contest.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Contest.prototype, "updatedAt", void 0);
Contest = __decorate([
    typeorm_1.Entity()
], Contest);
exports.Contest = Contest;
