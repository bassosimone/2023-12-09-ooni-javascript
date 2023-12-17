"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuicHandshakeValue = exports.quicConnectOptionTags = exports.quicHandshakeOptionRootCAs = exports.quicHandshakeOptionInsecureSkipVerify = void 0;
/** Sets insecure_skip_verify. */
function quicHandshakeOptionInsecureSkipVerify(skip) {
    return function (value) {
        value.insecure_skip_verify = skip;
    };
}
exports.quicHandshakeOptionInsecureSkipVerify = quicHandshakeOptionInsecureSkipVerify;
/** Sets root_cas */
function quicHandshakeOptionRootCAs() {
    var cas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        cas[_i] = arguments[_i];
    }
    return function (value) {
        value.root_cas = cas;
    };
}
exports.quicHandshakeOptionRootCAs = quicHandshakeOptionRootCAs;
/** Sets the tags. */
function quicConnectOptionTags() {
    var tags = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tags[_i] = arguments[_i];
    }
    return function (value) {
        value.tags = tags;
    };
}
exports.quicConnectOptionTags = quicConnectOptionTags;
/** Value of the quic_handshake node. */
var QuicHandshakeValue = /** @class */ (function () {
    function QuicHandshakeValue(input, nextProtos, output, serverName) {
        var options = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            options[_i - 4] = arguments[_i];
        }
        this.input = input;
        this.insecure_skip_verify = false;
        this.next_protos = nextProtos;
        this.output = output;
        this.root_cas = null;
        this.server_name = serverName;
        this.tags = null;
        for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
            var option = options_1[_a];
            option(this);
        }
    }
    return QuicHandshakeValue;
}());
exports.QuicHandshakeValue = QuicHandshakeValue;
