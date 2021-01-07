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
exports.JudgingToCriteria = void 0;
const typeorm_1 = require("typeorm");
const Judging_1 = require("./Judging");
const Criteria_1 = require("./Criteria");
let JudgingToCriteria = class JudgingToCriteria extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], JudgingToCriteria.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], JudgingToCriteria.prototype, "judgingId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Judging_1.Judging, judging => judging.judgingToCriterias),
    __metadata("design:type", Judging_1.Judging)
], JudgingToCriteria.prototype, "judging", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], JudgingToCriteria.prototype, "criteriaId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Criteria_1.Criteria, criteria => criteria.judgingToCriterias),
    __metadata("design:type", Criteria_1.Criteria)
], JudgingToCriteria.prototype, "criteria", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], JudgingToCriteria.prototype, "score", void 0);
__decorate([
    typeorm_1.Column({ type: 'text' }),
    __metadata("design:type", String)
], JudgingToCriteria.prototype, "comment", void 0);
JudgingToCriteria = __decorate([
    typeorm_1.Entity()
], JudgingToCriteria);
exports.JudgingToCriteria = JudgingToCriteria;
