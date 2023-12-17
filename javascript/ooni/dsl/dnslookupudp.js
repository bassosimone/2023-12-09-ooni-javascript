"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsLookupUdpValue = exports.dnsLookupUdpOptionTags = void 0;
/** Sets the tags. */
function dnsLookupUdpOptionTags() {
    var tags = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        tags[_i] = arguments[_i];
    }
    return function (value) {
        value.tags = tags;
    };
}
exports.dnsLookupUdpOptionTags = dnsLookupUdpOptionTags;
/** Value of the dns_lookup_udp node. */
var DnsLookupUdpValue = /** @class */ (function () {
    function DnsLookupUdpValue(domain, output, resolver) {
        var options = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            options[_i - 3] = arguments[_i];
        }
        this.domain = domain;
        this.output = output;
        this.resolver = resolver;
        this.tags = null;
        for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
            var option = options_1[_a];
            option(this);
        }
    }
    return DnsLookupUdpValue;
}());
exports.DnsLookupUdpValue = DnsLookupUdpValue;
