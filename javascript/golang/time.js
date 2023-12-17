"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.now = void 0;
// @ts-ignore
var _golang_1 = require("_golang");
function now() {
    return (0, _golang_1.timeNow)();
}
exports.now = now;
