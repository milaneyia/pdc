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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Log_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.LOG_TYPE = void 0;
const typeorm_1 = require("typeorm");
var LOG_TYPE;
(function (LOG_TYPE) {
    LOG_TYPE["General"] = "General";
    LOG_TYPE["User"] = "User";
    LOG_TYPE["Admin"] = "Admin";
    LOG_TYPE["Error"] = "Error";
})(LOG_TYPE = exports.LOG_TYPE || (exports.LOG_TYPE = {}));
let Log = Log_1 = class Log extends typeorm_1.BaseEntity {
    static createAndSave(text, type, typeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const log = new Log_1();
            log.text = text;
            log.type = type;
            if (typeId) {
                log.typeId = typeId;
            }
            yield log.save();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Log.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'text' }),
    __metadata("design:type", String)
], Log.prototype, "text", void 0);
__decorate([
    typeorm_1.Column({ type: 'enum', enum: LOG_TYPE, default: LOG_TYPE.General }),
    __metadata("design:type", String)
], Log.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], Log.prototype, "typeId", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Log.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Log.prototype, "updatedAt", void 0);
Log = Log_1 = __decorate([
    typeorm_1.Entity()
], Log);
exports.Log = Log;
