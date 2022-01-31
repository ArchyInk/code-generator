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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Archy
 * @Date: 2022-01-31 11:27:01
 * @LastEditors: Archy
 * @LastEditTime: 2022-01-31 21:49:06
 * @FilePath: \arkgen\server\src\routes\project.ts
 * @description:
 */
var express_1 = __importDefault(require("express"));
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var find_up_1 = __importDefault(require("find-up"));
var constants_1 = require("../shared/constants");
var Response_1 = __importDefault(require("../class/Response"));
var utils_1 = require("../shared/utils");
var router = express_1.default.Router();
router.get('/', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var resp, draft, pkgPath, pkg, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resp = new Response_1.default();
                draft = {
                    path: constants_1.CWD,
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, find_up_1.default)('package.json')];
            case 2:
                pkgPath = _a.sent();
                if (pkgPath) {
                    draft.hasPkg = true;
                    pkg = (0, fs_extra_1.readFileSync)(pkgPath, 'utf-8');
                    draft.pkg = JSON.parse(pkg);
                }
                else {
                    draft.hasPkg = false;
                }
                draft.dirs = (0, utils_1.dirDetail)(constants_1.CWD);
                resp.success = true;
                resp.msg = '获取项目详情成功！';
                resp.data = draft;
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                resp.success = false;
                resp.msg = err_1;
                return [3 /*break*/, 4];
            case 4:
                res.send(resp.toRes());
                return [2 /*return*/];
        }
    });
}); });
router.post('/dir', function (req, res, next) {
    var dirName = req.body.dirName;
    var resp = new Response_1.default();
    if (dirName) {
        var _dirname_1 = (0, path_1.join)(constants_1.CWD, dirName);
        if ((0, fs_extra_1.lstatSync)(_dirname_1).isDirectory()) {
            try {
                resp.data = (0, fs_extra_1.readdirSync)(_dirname_1).map(function (item) { return ({
                    name: item,
                    isDir: (0, fs_extra_1.lstatSync)((0, path_1.join)(_dirname_1, item)).isDirectory(),
                }); });
                resp.success = true;
                resp.msg = '获取目录下文件成功';
            }
            catch (err) {
                resp.msg = err;
            }
        }
        else {
            resp.msg = "".concat(dirName, " \u4E0D\u662F\u4E00\u4E2A\u76EE\u5F55");
        }
    }
    else {
        resp.msg = 'dirName 为必传参数!';
    }
    res.send(resp.toRes());
});
exports.default = router;
