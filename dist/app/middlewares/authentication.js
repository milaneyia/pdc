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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBasicUser = exports.isJudge = exports.isStaff = exports.authenticate = exports.simpleAuthenticate = void 0;
const User_1 = require("../models/User");
const osuApi_1 = require("./osuApi");
function sendResponse(ctx) {
    if (ctx.request.type === 'application/json') {
        return ctx.body = { error: 'Unauthorized' };
    }
    else {
        return ctx.render('error');
    }
}
function simpleAuthenticate(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User_1.User.findByOsuId(ctx.session.osuId);
        ctx.state.user = user;
        return yield next();
    });
}
exports.simpleAuthenticate = simpleAuthenticate;
function authenticate(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User_1.User.findByOsuId(ctx.session.osuId);
        if (user && !user.isRestricted) {
            ctx.state.user = user;
            if (Date.now() > ctx.session.expiresIn) {
                const response = yield osuApi_1.refreshToken(ctx.session.refreshToken);
                if (osuApi_1.isRequestError(response)) {
                    ctx.session = null;
                    return ctx.body = { error: 'Re-login..' };
                }
                ctx.session.expiresIn = Date.now() + (response.expires_in * 1000);
                ctx.session.accessToken = response.access_token;
                ctx.session.refreshToken = response.refresh_token;
            }
            return yield next();
        }
        else {
            return sendResponse(ctx);
        }
    });
}
exports.authenticate = authenticate;
function isStaff(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.state.user.isStaff) {
            return yield next();
        }
        else {
            return sendResponse(ctx);
        }
    });
}
exports.isStaff = isStaff;
function isJudge(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.state.user.isJudge) {
            return yield next();
        }
        else {
            return sendResponse(ctx);
        }
    });
}
exports.isJudge = isJudge;
function isBasicUser(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctx.state.user.isBasicUser) {
            return yield next();
        }
        else {
            return sendResponse(ctx);
        }
    });
}
exports.isBasicUser = isBasicUser;
