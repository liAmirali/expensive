"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_2 = require("./utils/path");
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use("/auth", auth_1.default);
app.use("/", (req, res) => {
    console.log("Hello!", path_2.rootDir);
    res.sendFile(path_1.default.join(path_2.rootDir, "view", "index.html"));
});
app.listen(port);
