"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.static("public"));
console.log("hello sup");
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.get('/', (req, res) => res.render('index.html'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
