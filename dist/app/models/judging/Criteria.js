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
exports.Criteria = void 0;
const typeorm_1 = require("typeorm");
const JudgingToCriteria_1 = require("./JudgingToCriteria");
let Criteria = class Criteria extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Criteria.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Criteria.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Criteria.prototype, "maxScore", void 0);
__decorate([
    typeorm_1.OneToMany(() => JudgingToCriteria_1.JudgingToCriteria, judgingToCriteria => judgingToCriteria.criteria),
    __metadata("design:type", Array)
], Criteria.prototype, "judgingToCriterias", void 0);
Criteria = __decorate([
    typeorm_1.Entity()
], Criteria);
exports.Criteria = Criteria;
