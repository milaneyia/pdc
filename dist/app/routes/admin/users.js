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
const helpers_1 = require("../../helpers");
const authentication_1 = require("../../middlewares/authentication");
const User_1 = require("../../models/User");
const Role_1 = require("../../models/Role");
const Log_1 = require("../../models/Log");
const typeorm_1 = require("typeorm");
const usersAdminRouter = new router_1.default();
usersAdminRouter.prefix('/api/admin/users');
usersAdminRouter.use(authentication_1.authenticate);
usersAdminRouter.use(authentication_1.isStaff);
usersAdminRouter.get('/roles', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const roles = yield Role_1.Role.find({
        id: typeorm_1.Not(Role_1.ROLE.Staff),
    });
    ctx.body = {
        roles,
    };
}));
usersAdminRouter.get('/query', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const query = ctx.query.u;
    const users = yield User_1.User.find({
        where: [
            { username: typeorm_1.Like(`%${query}%`) },
            { osuId: query },
        ],
    });
    ctx.body = {
        users,
    };
}));
usersAdminRouter.post('/:id/updateRole', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const roleId = helpers_1.convertToIntOrThrow(ctx.request.body.roleId);
    if (roleId === Role_1.ROLE.Staff) {
        return ctx.body = {
            error: 'Not a valid role',
        };
    }
    const [user, role] = yield Promise.all([
        User_1.User.findOneOrFail({
            id: ctx.params.id,
            roleId: typeorm_1.Not(Role_1.ROLE.Staff),
        }),
        Role_1.Role.findOneOrFail({
            id: roleId,
        }),
    ]);
    user.roleId = role.id;
    yield user.save();
    ctx.body = {
        success: 'Updated',
    };
    Log_1.Log.createAndSave(`${ctx.state.user.username} changed ${user.username} role to ${role.name}`, Log_1.LOG_TYPE.Admin, user.id);
}));
exports.default = usersAdminRouter;
