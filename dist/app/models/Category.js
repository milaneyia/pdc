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
exports.Category = void 0;
const typeorm_1 = require("typeorm");
const Contest_1 = require("./Contest");
const Song_1 = require("./Song");
let Category = class Category extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Category.prototype, "contestId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Contest_1.Contest, (contest) => contest.categories, { nullable: false }),
    __metadata("design:type", Contest_1.Contest)
], Category.prototype, "contest", void 0);
__decorate([
    typeorm_1.OneToMany(() => Song_1.Song, (song) => song.category),
    __metadata("design:type", Array)
], Category.prototype, "songs", void 0);
Category = __decorate([
    typeorm_1.Entity()
], Category);
exports.Category = Category;
