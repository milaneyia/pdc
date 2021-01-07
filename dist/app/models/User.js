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
var User_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Role_1 = require("./Role");
const Submission_1 = require("./Submission");
const Vote_1 = require("./Vote");
let User = User_1 = class User extends typeorm_1.BaseEntity {
    static findByOsuId(osuId) {
        return User_1.findOne({
            where: { osuId },
        });
    }
    getVirtuals() {
        this.isStaff = this.roleId === Role_1.ROLE.Staff;
        this.isJudge = this.roleId === Role_1.ROLE.Judge || this.isStaff;
        this.isBasicUser = this.roleId === Role_1.ROLE.BasicUser || this.isStaff;
        this.isRestricted = this.roleId === Role_1.ROLE.Restricted;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", Number)
], User.prototype, "osuId", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], User.prototype, "roleId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Role_1.Role, { nullable: false }),
    __metadata("design:type", Role_1.Role)
], User.prototype, "role", void 0);
__decorate([
    typeorm_1.OneToMany(() => Submission_1.Submission, (submission) => submission.user),
    __metadata("design:type", Array)
], User.prototype, "submissions", void 0);
__decorate([
    typeorm_1.OneToMany(() => Vote_1.Vote, (vote) => vote.user),
    __metadata("design:type", Array)
], User.prototype, "votes", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.AfterLoad(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "getVirtuals", null);
User = User_1 = __decorate([
    typeorm_1.Entity()
], User);
exports.User = User;
