"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlsHandshakeValue = exports.tlsHandshakeOptionRootCAs = exports.tlsHandshakeOptionInsecureSkipVerify = void 0;
/** Sets insecure_skip_verify. */
function tlsHandshakeOptionInsecureSkipVerify(skip) {
    return function (value) {
        value.insecure_skip_verify = skip;
    };
}
exports.tlsHandshakeOptionInsecureSkipVerify = tlsHandshakeOptionInsecureSkipVerify;
/** Sets root_cas */
function tlsHandshakeOptionRootCAs() {
    var cas = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        cas[_i] = arguments[_i];
    }
    return function (value) {
        value.root_cas = cas;
    };
}
exports.tlsHandshakeOptionRootCAs = tlsHandshakeOptionRootCAs;
/** Value of the tls_handshake node. */
var TlsHandshakeValue = /** @class */ (function () {
    function TlsHandshakeValue(input, nextProtos, output, serverName) {
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
        for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
            var option = options_1[_a];
            option(this);
        }
    }
    return TlsHandshakeValue;
}());
exports.TlsHandshakeValue = TlsHandshakeValue;
