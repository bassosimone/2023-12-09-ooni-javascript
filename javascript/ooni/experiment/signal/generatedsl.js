"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDsl = void 0;
var dsl_1 = require("../../dsl");
function generateDslForHttps(builder, domain, tag, certs) {
    // properly transform the tag into a key=value format
    tag = "target=".concat(tag);
    // obtain IP addrs from the domain name
    var addrs = builder.getaddrinfo(domain, (0, dsl_1.getaddrinfoOptionTags)(tag));
    // map addrs to endpoints
    var endpoints = builder.makeEndpoints("443", addrs);
    // establish TCP connections
    var tcpConnections = builder.tcpConnect(endpoints, (0, dsl_1.tcpConnectOptionTags)(tag));
    // perform TLS handshakes with the custom root CAs
    var tlsConnections = builder.tlsHandshake(domain, ["h2", "http/1.1"], tcpConnections, dsl_1.tlsHandshakeOptionRootCAs.apply(void 0, certs));
    // make sure we use juse a single connection for the HTTP round trip
    var firstConn = builder.takeN(1, tlsConnections);
    // perform HTTP round trips
    builder.httpRoundTrip(domain, firstConn);
}
function generateDslForUptime(builder) {
    // obtain IP adds from the domain name
    var addrs = builder.getaddrinfo("uptime.signal.org");
    // drop the results since we don't need to do anything with them
    builder.drop(addrs);
}
/** Generates the DSL for measuring signal using the given richer input. */
function generateDsl(input) {
    // create the builder
    var builder = new dsl_1.Builder();
    // build DSL for HTTPS
    for (var _i = 0, _a = input.https_targets; _i < _a.length; _i++) {
        var entry = _a[_i];
        generateDslForHttps(builder, entry.domain, entry.targetTag, input.certs);
    }
    // build DSL for uptime.signal.org
    generateDslForUptime(builder);
    // return the root node
    return builder.buildRootNode();
}
exports.generateDsl = generateDsl;
