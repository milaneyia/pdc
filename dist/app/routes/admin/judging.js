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
const Song_1 = require("../../models/Song");
const judgingAdminRouter = new router_1.default();
judgingAdminRouter.prefix('/api/admin/judging');
judgingAdminRouter.use(authentication_1.authenticate);
judgingAdminRouter.use(authentication_1.isStaff);
judgingAdminRouter.get('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield Song_1.Song.find({
        where: {
            wasChosen: true,
        },
        relations: [
            'submissions',
            'submissions.judging',
            'submissions.judging.judge',
            'submissions.judging.judgingToCriterias',
            'submissions.judging.judgingToCriterias.criteria',
        ],
    });
    ctx.body = {
        songs,
    };
}));
exports.default = judgingAdminRouter;
