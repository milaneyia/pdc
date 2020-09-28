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
exports.Song = void 0;
const typeorm_1 = require("typeorm");
const Contest_1 = require("./Contest");
const Submission_1 = require("./Submission");
const Vote_1 = require("./Vote");
let Song = class Song extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Song.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Song.prototype, "artist", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Song.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Song.prototype, "previewLink", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Song.prototype, "isFa", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Song.prototype, "wasChosen", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Song.prototype, "contestId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Contest_1.Contest, (contest) => contest.songs, { nullable: false }),
    __metadata("design:type", Contest_1.Contest)
], Song.prototype, "contest", void 0);
__decorate([
    typeorm_1.OneToMany(() => Submission_1.Submission, (submission) => submission.song),
    __metadata("design:type", Array)
], Song.prototype, "submissions", void 0);
__decorate([
    typeorm_1.OneToMany(() => Vote_1.Vote, (vote) => vote.song),
    __metadata("design:type", Array)
], Song.prototype, "votes", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Song.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Song.prototype, "updatedAt", void 0);
Song = __decorate([
    typeorm_1.Entity()
], Song);
exports.Song = Song;
