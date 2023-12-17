"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.now = exports.Time = void 0;
// @ts-ignore
var _golang_1 = require("_golang");
/** Golang time representation. */
var Time = /** @class */ (function () {
    function Time(v) {
        this.v = v;
    }
    return Time;
}());
exports.Time = Time;
function now() {
    return new Time((0, _golang_1.timeNow)());
}
exports.now = now;
