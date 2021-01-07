"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const authentication_1 = require("../../middlewares/authentication");
const Log_1 = require("../../models/Log");
const typeorm_1 = require("typeorm");
const logsRouter = new router_1.default();
logsRouter.prefix('/api/admin/logs');
logsRouter.use(authentication_1.authenticate);
logsRouter.use(authentication_1.isStaff);
logsRouter.get('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const logs = yield Log_1.Log.find({
        where: {
            type: typeorm_1.Not(Log_1.LOG_TYPE.Error),
        },
        skip: ctx.query.s || 0,
        take: 50,
        order: {
            createdAt: 'DESC',
        },
    });
    if (!logs.length) {
        return ctx.body = {
            error: 'No more logs',
        };
    }
    ctx.body = {
        logs,
    };
}));
exports.default = logsRouter;
