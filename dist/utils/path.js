"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootDir = void 0;
const path = require("path");
exports.rootDir = path
    .dirname((_a = require.main) === null || _a === void 0 ? void 0 : _a.filename)
    .replace(/(\/dist)$/, "");
