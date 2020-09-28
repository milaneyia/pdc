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
exports.isRequestError = exports.getUserInfo = exports.refreshToken = exports.getToken = exports.decodeState = exports.generateAuthorizeUrl = exports.generateState = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const querystring_1 = __importDefault(require("querystring"));
const config_json_1 = __importDefault(require("../../config.json"));
function generateState() {
    return crypto_1.default.randomBytes(48).toString('hex');
}
exports.generateState = generateState;
function generateAuthorizeUrl(rawState) {
    const hashedState = Buffer.from(rawState).toString('base64');
    return 'https://osu.ppy.sh/oauth/authorize?response_type=code' +
        '&client_id=' + config_json_1.default.osuv2.id +
        '&redirect_uri=' + encodeURIComponent(config_json_1.default.osuv2.redirect) +
        '&state=' + hashedState +
        '&scope=identify';
}
exports.generateAuthorizeUrl = generateAuthorizeUrl;
function decodeState(hashedState) {
    return Buffer.from(hashedState, 'base64').toString('ascii');
}
exports.decodeState = decodeState;
function getToken(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = querystring_1.default.stringify({
            client_id: config_json_1.default.osuv2.id,
            client_secret: config_json_1.default.osuv2.secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: config_json_1.default.osuv2.redirect,
        });
        const options = {
            data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'post',
            url: 'https://osu.ppy.sh/oauth/token',
        };
        try {
            const res = yield axios_1.default(options);
            return res.data;
        }
        catch (error) {
            return { error };
        }
    });
}
exports.getToken = getToken;
function refreshToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = querystring_1.default.stringify({
            client_id: config_json_1.default.osuv2.id,
            client_secret: config_json_1.default.osuv2.secret,
            grant_type: 'refresh_token',
            refresh_token: token,
        });
        const options = {
            data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            url: 'https://osu.ppy.sh/oauth/token',
        };
        try {
            const res = yield axios_1.default(options);
            return res.data;
        }
        catch (error) {
            return { error };
        }
    });
}
exports.refreshToken = refreshToken;
function getUserInfo(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'GET',
            url: 'https://osu.ppy.sh/api/v2/me',
        };
        try {
            const res = yield axios_1.default(options);
            return res.data;
        }
        catch (error) {
            return { error };
        }
    });
}
exports.getUserInfo = getUserInfo;
function isRequestError(errorRequest) {
    return errorRequest.error !== undefined;
}
exports.isRequestError = isRequestError;
