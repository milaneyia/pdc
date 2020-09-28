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
exports.Judging = void 0;
const typeorm_1 = require("typeorm");
const Submission_1 = require("../Submission");
const User_1 = require("../User");
const JudgingToCriteria_1 = require("./JudgingToCriteria");
let Judging = class Judging extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Judging.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Judging.prototype, "judgeId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => User_1.User, { nullable: false }),
    __metadata("design:type", User_1.User)
], Judging.prototype, "judge", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Judging.prototype, "submissionId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Submission_1.Submission, (submission) => submission.judging, { nullable: false }),
    __metadata("design:type", Submission_1.Submission)
], Judging.prototype, "submission", void 0);
__decorate([
    typeorm_1.OneToMany(() => JudgingToCriteria_1.JudgingToCriteria, judgingToCriteria => judgingToCriteria.judging),
    __metadata("design:type", Array)
], Judging.prototype, "judgingToCriterias", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Judging.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Judging.prototype, "updatedAt", void 0);
Judging = __decorate([
    typeorm_1.Entity()
], Judging);
exports.Judging = Judging;
