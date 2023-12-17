"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TcpConnectValue = exports.tcpConnectOptionTags = void 0;
/** Sets the tags. */
function tcpConnectOptionTags() {
    var tags = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tags[_i] = arguments[_i];
    }
    return function (value) {
        value.tags = tags;
    };
}
exports.tcpConnectOptionTags = tcpConnectOptionTags;
/** Value of the tcp_connect node. */
var TcpConnectValue = /** @class */ (function () {
    function TcpConnectValue(input, output) {
        var options = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            options[_i - 2] = arguments[_i];
        }
        this.input = input;
        this.output = output;
        this.tags = null;
        for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
            var option = options_1[_a];
            option(this);
        }
    }
    return TcpConnectValue;
}());
exports.TcpConnectValue = TcpConnectValue;
