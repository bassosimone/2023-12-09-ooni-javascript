"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = exports.RootNode = exports.StageNode = void 0;
var dedupaddrs_1 = require("./dedupaddrs");
var dnslookupudp_1 = require("./dnslookupudp");
var drop_1 = require("./drop");
var getaddrinfo_1 = require("./getaddrinfo");
var http_1 = require("./http");
var makeendpoints_1 = require("./makeendpoints");
var quic_1 = require("./quic");
var taken_1 = require("./taken");
var tcp_1 = require("./tcp");
var teeaddrs_1 = require("./teeaddrs");
var tls_1 = require("./tls");
/** A node inside the DSL. */
var StageNode = /** @class */ (function () {
    function StageNode(name, value) {
        this.name = name;
        this.value = value;
    }
    return StageNode;
}());
exports.StageNode = StageNode;
/** The root node of the DSL. */
var RootNode = /** @class */ (function () {
    function RootNode(stages) {
        this.stages = stages;
    }
    return RootNode;
}());
exports.RootNode = RootNode;
/** Builds the DSL. */
var Builder = /** @class */ (function () {
    function Builder() {
        this.stages = [];
        this.nextRegisterId = 0;
    }
    Builder.prototype.push = function (name, value) {
        this.stages.push(new StageNode(name, value));
    };
    Builder.prototype.newRegister = function () {
        var value = this.nextRegisterId;
        this.nextRegisterId += 1;
        return "$".concat(value);
    };
    /** Builds and returns the root node of the DSL. */
    Builder.prototype.buildRootNode = function () {
        return new RootNode(this.stages);
    };
    /** Adds a dedup_addrs node to the DSL and returns the output register. */
    Builder.prototype.dedup_addrs = function () {
        var inputs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputs[_i] = arguments[_i];
        }
        var output = this.newRegister();
        var value = new dedupaddrs_1.DedupAddrsValue(inputs, output);
        this.push("dedup_addrs", value);
        return output;
    };
    /** Adds a dns_lookup_udp node to the DSL and returns the output register. */
    Builder.prototype.dnsLookupUdp = function (domain, resolver) {
        var options = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            options[_i - 2] = arguments[_i];
        }
        var output = this.newRegister();
        var value = new (dnslookupudp_1.DnsLookupUdpValue.bind.apply(dnslookupudp_1.DnsLookupUdpValue, __spreadArray([void 0, domain, output, resolver], options, false)))();
        this.push("dns_lookup_udp", value);
        return output;
    };
    /** Adds a drop node to the DSL. */
    Builder.prototype.drop = function (input) {
        var output = this.newRegister();
        var value = new drop_1.DropValue(input, output);
        this.push("drop", value);
    };
    /** Adds a getaddrinfo node to the DSL and returns the output register. */
    Builder.prototype.getaddrinfo = function (domain) {
        var options = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            options[_i - 1] = arguments[_i];
        }
        var output = this.newRegister();
        var value = new (getaddrinfo_1.GetaddrinfoValue.bind.apply(getaddrinfo_1.GetaddrinfoValue, __spreadArray([void 0, domain, output], options, false)))();
        this.push("getaddrinfo", value);
        return output;
    };
    /** Adds an http_round_trip node to the DSL. */
    Builder.prototype.httpRoundTrip = function (host, input) {
        var options = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            options[_i - 2] = arguments[_i];
        }
        var output = this.newRegister();
        var value = new (http_1.HttpRoundTripValue.bind.apply(http_1.HttpRoundTripValue, __spreadArray([void 0, input, host, output], options, false)))();
        this.push("http_round_trip", value);
    };
    /** Adds a make_endpoints node to the DSL and returns the output register. */
    Builder.prototype.makeEndpoints = function (port, input) {
        var output = this.newRegister();
        var value = new makeendpoints_1.MakeEndpointsValue(input, output, port);
        this.push("make_endpoints", value);
        return output;
    };
    /** Adds a quic_handshake node to the DSL and returns the output register. */
    Builder.prototype.quicHandshake = function (serverName, nextProtos, input) {
        var options = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            options[_i - 3] = arguments[_i];
        }
        var output = this.newRegister();
        var value = new (quic_1.QuicHandshakeValue.bind.apply(quic_1.QuicHandshakeValue, __spreadArray([void 0, input, nextProtos, output, serverName], options, false)))();
        this.push("quic_handshake", value);
        return output;
    };
    /** Adds a take_n node to the DSL and returns the output register. */
    Builder.prototype.takeN = function (count, input) {
        var output = this.newRegister();
        var value = new taken_1.TakeNValue(input, count, output);
        this.push("take_n", value);
        return output;
    };
    /** Adds a tcp_connect node to the DSL and returns the output register. */
    Builder.prototype.tcpConnect = function (input) {
        var options = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            options[_i - 1] = arguments[_i];
        }
        var output = this.newRegister();
        var value = new (tcp_1.TcpConnectValue.bind.apply(tcp_1.TcpConnectValue, __spreadArray([void 0, input, output], options, false)))();
        this.push("tcp_connect", value);
        return output;
    };
    /** Adds a tee_addrs node to the DSL. */
    Builder.prototype.teeAddrs = function (input) {
        var callbacks = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            callbacks[_i - 1] = arguments[_i];
        }
        var outputs = [];
        for (var _a = 0, callbacks_1 = callbacks; _a < callbacks_1.length; _a++) {
            var callback = callbacks_1[_a];
            var output = this.newRegister();
            callback(output);
            outputs.push(output);
        }
        this.push("tee_addrs", new teeaddrs_1.TeeAddrsValue(input, outputs));
    };
    /** Adds a tls_handshake node to the DSL and returns the output register. */
    Builder.prototype.tlsHandshake = function (serverName, nextProtos, input) {
        var options = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            options[_i - 3] = arguments[_i];
        }
        var output = this.newRegister();
        var value = new (tls_1.TlsHandshakeValue.bind.apply(tls_1.TlsHandshakeValue, __spreadArray([void 0, input, nextProtos, output, serverName], options, false)))();
        this.push("tls_handshake", value);
        return output;
    };
    return Builder;
}());
exports.Builder = Builder;
