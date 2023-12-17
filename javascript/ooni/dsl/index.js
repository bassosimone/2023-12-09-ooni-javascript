"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.tlsHandshakeOptionRootCAs = exports.tcpConnectOptionTags = exports.getaddrinfoOptionTags = exports.Builder = void 0;
var builder_1 = require("./builder");
Object.defineProperty(exports, "Builder", { enumerable: true, get: function () { return builder_1.Builder; } });
var getaddrinfo_1 = require("./getaddrinfo");
Object.defineProperty(exports, "getaddrinfoOptionTags", { enumerable: true, get: function () { return getaddrinfo_1.getaddrinfoOptionTags; } });
var tcp_1 = require("./tcp");
Object.defineProperty(exports, "tcpConnectOptionTags", { enumerable: true, get: function () { return tcp_1.tcpConnectOptionTags; } });
var tls_1 = require("./tls");
Object.defineProperty(exports, "tlsHandshakeOptionRootCAs", { enumerable: true, get: function () { return tls_1.tlsHandshakeOptionRootCAs; } });
// @ts-ignore
var _ooni_1 = require("_ooni");
/** Runs a DSL with the given DSL @p rootNode and @p zeroTime. */
function run(rootNode, zeroTime) {
    var tk = (0, _ooni_1.runDSL)(rootNode, zeroTime);
    return JSON.parse(tk);
}
exports.run = run;
