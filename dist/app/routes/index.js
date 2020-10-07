"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const osuApi = __importStar(require("../middlewares/osuApi"));
const Role_1 = require("../models/Role");
const Contest_1 = require("../models/Contest");
const User_1 = require("../models/User");
const indexRouter = new router_1.default();
indexRouter.get('/api/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const osuId = ctx.session.osuId;
    let user;
    if (osuId) {
        user = yield User_1.User.findByOsuId(osuId);
    }
    const contest = yield Contest_1.Contest.findForResults(user === null || user === void 0 ? void 0 : user.isStaff);
    ctx.body = {
        contest,
        user,
    };
}));
indexRouter.get('/login', (ctx) => {
    const state = osuApi.generateState();
    ctx.cookies.set('_state', state);
    ctx.session.redirectTo = ctx.request.header.referer;
    return ctx.redirect(osuApi.generateAuthorizeUrl(state));
});
indexRouter.get('/logout', (ctx) => {
    ctx.session = null;
    return ctx.redirect('/');
});
indexRouter.get('/callback', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ctx.query.code || ctx.query.error) {
        return ctx.render('error');
    }
    const decodedState = osuApi.decodeState(ctx.query.state);
    const savedState = ctx.cookies.get('_state');
    ctx.cookies.set('_state', undefined);
    if (decodedState !== savedState) {
        return ctx.render('error');
    }
    const response = yield osuApi.getToken(ctx.query.code);
    if (osuApi.isRequestError(response)) {
        return ctx.render('error');
    }
    else {
        const userResponse = yield osuApi.getUserInfo(response.access_token);
        if (osuApi.isRequestError(userResponse)) {
            ctx.session = null;
            return ctx.render('error');
        }
        ctx.session.expiresIn = Date.now() + (response.expires_in * 1000);
        ctx.session.accessToken = response.access_token;
        ctx.session.refreshToken = response.refresh_token;
        ctx.session.osuId = userResponse.id;
        ctx.session.username = userResponse.username;
        let user = yield User_1.User.findOne({ where: { osuId: userResponse.id } });
        if (!user) {
            user = yield User_1.User.create({
                osuId: userResponse.id,
                roleId: Role_1.ROLE.BasicUser,
                username: userResponse.username,
            }).save();
        }
        if (user) {
            const redirectUrl = ctx.session.redirectTo || '/';
            ctx.session.redirectTo = null;
            return ctx.redirect(redirectUrl);
        }
        ctx.session = null;
        return ctx.render('error');
    }
}));
exports.default = indexRouter;
