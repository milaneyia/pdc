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
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_helmet_1 = __importDefault(require("koa-helmet"));
const koa_session_1 = __importDefault(require("koa-session"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_views_1 = __importDefault(require("koa-views"));
const path_1 = __importDefault(require("path"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const config_json_1 = __importDefault(require("../config.json"));
const routes_1 = __importDefault(require("./routes"));
const submissions_1 = __importDefault(require("./routes/admin/submissions"));
const judging_1 = __importDefault(require("./routes/judging"));
const results_1 = __importDefault(require("./routes/results"));
const submissions_2 = __importDefault(require("./routes/submissions"));
const users_1 = __importDefault(require("./routes/admin/users"));
const logs_1 = __importDefault(require("./routes/admin/logs"));
const contests_1 = __importDefault(require("./routes/admin/contests"));
const voting_1 = __importDefault(require("./routes/voting"));
const Log_1 = require("./models/Log");
const app = new koa_1.default();
app.keys = config_json_1.default.keys;
typeorm_1.createConnection().then(() => {
    console.log('DB initializated');
}).catch((err) => {
    console.log(err);
});
app.use(koa_helmet_1.default());
app.use(koa_session_1.default({
    key: 'pdc:sess',
    maxAge: 432000000,
    renew: true,
    sameSite: 'lax',
}, app));
app.use(koa_static_1.default(path_1.default.join(__dirname, '../public')));
app.use(koa_bodyparser_1.default());
app.use(koa_views_1.default(path_1.default.join(__dirname, '../public')));
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (ctx.originalUrl !== '/favicon.ico') {
            console.log('\x1b[33m%s\x1b[0m', ctx.originalUrl);
        }
        yield next();
        if (ctx.status === 404) {
            yield ctx.render('index');
        }
    }
    catch (err) {
        ctx.status = err.status || 500;
        if (ctx.accepts('application/json') === 'application/json') {
            ctx.body = { error: 'Something went wrong!' };
        }
        else {
            yield ctx.render('error');
        }
        ctx.app.emit('error', err, ctx);
    }
}));
app.use(routes_1.default.routes());
app.use(routes_1.default.allowedMethods());
app.use(results_1.default.routes());
app.use(results_1.default.allowedMethods());
app.use(voting_1.default.routes());
app.use(voting_1.default.allowedMethods());
app.use(submissions_2.default.routes());
app.use(submissions_2.default.allowedMethods());
app.use(judging_1.default.routes());
app.use(judging_1.default.allowedMethods());
app.use(users_1.default.routes());
app.use(users_1.default.allowedMethods());
app.use(contests_1.default.routes());
app.use(contests_1.default.allowedMethods());
app.use(submissions_1.default.routes());
app.use(submissions_1.default.allowedMethods());
app.use(logs_1.default.routes());
app.use(logs_1.default.allowedMethods());
app.on('error', (err, ctx) => {
    console.log(err);
    const text = JSON.stringify({
        osuId: ctx.session.osuId,
        username: ctx.session.username,
        stack: err.stack,
    });
    Log_1.Log.createAndSave(text, Log_1.LOG_TYPE.Error);
});
app.listen(3001);
