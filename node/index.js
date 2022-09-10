"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var port = 3000;
app.get('/', function (req, res) { return res.send('Hello Multiverse!'); });
app.listen(port, function () { return console.log("Example app listening on port " + port + "!"); });
