"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByTypeAndFailure = exports.filterByTargetTag = exports.WebObservationsContainter = exports.WebObservation = void 0;
/** The last operation in a WebOservation is DNS lookup. */
var TypeDNSLookup = 0;
/** The last operation in a WebOservation is TCP connect. */
var TypeTCPConnect = 1;
/** The last operation in a WebOservation is TLS handshake. */
var TypeTLSHandshake = 2;
/** The last operation in a WebOservation is HTTP round trip. */
var TypeHTTPRoundTrip = 3;
/** Observation of a web measurement including DNS, TCP, TLS, QUIC, and HTTP. */
var WebObservation = /** @class */ (function () {
    function WebObservation() {
        // Common fields
        /** The tag containing the depth of the request chain. */
        // TODO(basosimone): implement
        //tagDepth?: number
        /** The type of this web observation. */
        this.type = 0;
        /** Whether there was a failure. */
        this.failure = null;
        /** The tag containing information on whether we're fetching a body. */
        // TODO(basosimone): implement
        //tagFethBody?: boolean
        /** The tag containing the target we're measuring. */
        this.tagTarget = null;
    }
    return WebObservation;
}());
exports.WebObservation = WebObservation;
/** Utility function to get the target= tag given the list of tags. */
function getTargetTag(tags) {
    for (var _i = 0, _a = (tags || []); _i < _a.length; _i++) {
        var tag = _a[_i];
        if (tag.indexOf("target=", 0) !== 0) {
            continue;
        }
        return tag.replace(/^target=/, "");
    }
    return null;
}
/** Utility function to join an address and a port. */
function netJoinHostPort(address, port) {
    if (address.indexOf(":") >= 0) {
        return "[".concat(address, "]:").concat(port);
    }
    return "".concat(address, ":").concat(port);
}
/** Container for organizing WebObservation structs. */
var WebObservationsContainter = /** @class */ (function () {
    function WebObservationsContainter() {
        /** Failed DNS lookups. */
        this.dnsLookupFailures = [];
        /** Successful DNS lookups. */
        this.dnsLookupSuccesses = [];
        /** Observations pertainting to known TCP endpoints. */
        this.knownTcpEndpoints = {};
        /** Mapping between an IP address and the web observation discovering it. */
        this.knownIpAddresses = {};
    }
    /** Load from archival observations. */
    WebObservationsContainter.prototype.ingestArchivalObservations = function (ao) {
        this.ingestDnsLookupEvents.apply(this, (ao.queries) || []);
        this.ingestTcpConnectEvents.apply(this, (ao.tcp_connect) || []);
        this.ingestTlsHandshakeEvents.apply(this, (ao.tls_handshakes) || []);
        this.ingestHttpRoundTripEvents.apply(this, (ao.requests) || []);
    };
    /** Loads DNS lookup events. */
    WebObservationsContainter.prototype.ingestDnsLookupEvents = function () {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        this.ingestDnsLookupFailures.apply(this, events);
        this.ingestDnsLookupSuccesses.apply(this, events);
    };
    WebObservationsContainter.prototype.ingestDnsLookupFailures = function () {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        for (var _a = 0, events_1 = events; _a < events_1.length; _a++) {
            var event_1 = events_1[_a];
            // skip all the succesful queries
            if (event_1.failure === undefined || event_1.failure === null) {
                continue;
            }
            // create record
            var obs = new WebObservation();
            obs.type = TypeDNSLookup;
            obs.failure = event_1.failure;
            obs.transactionId = event_1.transaction_id;
            obs.tagTarget = getTargetTag(event_1.tags);
            obs.dnsTransactionId = event_1.transaction_id;
            obs.dnsDomain = event_1.hostname;
            obs.dnsLookupFailure = event_1.failure;
            obs.dnsQueryType = event_1.query_type;
            obs.dnsEngine = event_1.engine;
            // TODO(bassosimone): add these fields
            // TagDepth: utilsExtractTagDepth(ev.Tags),
            // add record
            this.dnsLookupFailures.push(obs);
        }
    };
    WebObservationsContainter.prototype.ingestDnsLookupSuccesses = function () {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        for (var _a = 0, events_2 = events; _a < events_2.length; _a++) {
            var event_2 = events_2[_a];
            // skip all the failed queries
            if (event_2.failure === undefined || event_2.failure !== null) {
                continue;
            }
            // walk through the answers
            for (var _b = 0, _c = (event_2.answers || []); _b < _c.length; _b++) {
                var answer = _c[_b];
                var address = "";
                // only include the cases where we resolved an address
                if (answer.answer_type === "A") {
                    address = answer.ipv4 || "";
                }
                else if (answer.answer_type === "AAAA") {
                    address = answer.ipv6 || "";
                }
                else {
                    continue;
                }
                // create the record
                var obs = new WebObservation();
                obs.type = TypeDNSLookup;
                obs.failure = null;
                obs.transactionId = event_2.transaction_id;
                obs.tagTarget = getTargetTag(event_2.tags);
                obs.dnsTransactionId = event_2.transaction_id;
                obs.dnsDomain = event_2.hostname;
                obs.dnsLookupFailure = null;
                obs.dnsQueryType = event_2.query_type;
                obs.dnsEngine = event_2.engine;
                obs.ipAddress = address;
                // TODO(bassosimone): add these fields
                //DNSResolvedAddrs: optional.Some(addrs),
                //TagDepth:         utilsExtractTagDepth(ev.Tags),
                // add record
                this.dnsLookupSuccesses.push(obs);
                // store the first lookup that resolved this address
                if (this.knownIpAddresses[address] !== undefined) {
                    continue;
                }
                this.knownIpAddresses[address] = obs;
            }
        }
    };
    /** Loads TCP connect events. */
    WebObservationsContainter.prototype.ingestTcpConnectEvents = function () {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        for (var _a = 0, events_3 = events; _a < events_3.length; _a++) {
            var event_3 = events_3[_a];
            // make sure we have a transaction ID
            if (event_3.transaction_id === undefined) {
                continue;
            }
            var txid = event_3.transaction_id;
            // create or fetch a record
            var base = this.knownIpAddresses[event_3.ip];
            if (base === undefined) {
                base = new WebObservation();
                base.ipAddress = event_3.ip;
            }
            // clone the record because the same IP address MAY belong
            // to multiple endpoints across the same measurement
            //
            // while there also fill endpoint specific info
            var obs = new WebObservation();
            obs.type = TypeTCPConnect;
            obs.failure = event_3.status.failure;
            obs.transactionId = txid;
            obs.tagTarget = getTargetTag(event_3.tags);
            obs.dnsTransactionId = base.dnsTransactionId;
            obs.dnsDomain = base.dnsDomain;
            obs.dnsLookupFailure = base.dnsLookupFailure;
            obs.ipAddress = base.ipAddress;
            obs.endpointTransactionId = event_3.transaction_id;
            obs.endpointProto = "tcp";
            obs.endpointPort = "".concat(event_3.port);
            obs.endpointAddress = netJoinHostPort(event_3.ip, "".concat(event_3.port));
            obs.tcpConnectFailure = event_3.status.failure;
            // TODO(bassosimone): add these fields
            //DNSResolvedAddrs:      base.DNSResolvedAddrs,
            //IPAddressASN:          base.IPAddressASN,
            //IPAddressBogon:        base.IPAddressBogon,
            //TagDepth:              utilsExtractTagDepth(ev.Tags),
            //TagFetchBody:          utilsExtractTagFetchBody(ev.Tags),
            // register the observation
            this.knownTcpEndpoints[txid] = obs;
        }
    };
    /** Loads TLS handshake events. */
    WebObservationsContainter.prototype.ingestTlsHandshakeEvents = function () {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        for (var _a = 0, events_4 = events; _a < events_4.length; _a++) {
            var event_4 = events_4[_a];
            // make sure we have a transaction ID
            if (event_4.transaction_id === undefined) {
                continue;
            }
            var txid = event_4.transaction_id;
            // find the corresponding obs
            var obs = this.knownTcpEndpoints[txid];
            if (obs === undefined) {
                continue;
            }
            // update the record
            obs.type = TypeTLSHandshake;
            obs.failure = event_4.failure;
            obs.tlsHandshakeFailure = event_4.failure;
            obs.tlsServerName = event_4.server_name;
        }
    };
    /** Loads HTTP round trip events. */
    WebObservationsContainter.prototype.ingestHttpRoundTripEvents = function () {
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        for (var _a = 0, events_5 = events; _a < events_5.length; _a++) {
            var event_5 = events_5[_a];
            // make sure we have a transaction ID
            if (event_5.transaction_id === undefined) {
                continue;
            }
            var txid = event_5.transaction_id;
            // find the corresponding obs
            var obs = this.knownTcpEndpoints[txid];
            if (obs === undefined) {
                continue;
            }
            // start updating record
            obs.type = TypeHTTPRoundTrip;
            obs.failure = event_5.failure;
            obs.httpRequestURL = event_5.request.url;
            obs.httpFailure = event_5.failure;
            // consider the response authoritative only in case of success
            if (event_5.failure === undefined || event_5.failure !== null) {
                continue;
            }
            obs.httpResponseStatusCode = event_5.response.code;
            // TODO(bassosimone): add these fields
            //obs.httpResponseBodyLength = optional.Some(int64(len(ev.Response.Body)))
            //obs.httpResponseBodyIsTruncated = optional.Some(ev.Request.BodyIsTruncated)
            //obs.httpResponseHeadersKeys = utilsExtractHTTPHeaderKeys(ev.Response.Headers)
            //obs.httpResponseTitle = optional.Some(measurexlite.WebGetTitle(string(ev.Response.Body)))
            //obs.httpResponseLocation = utilsExtractHTTPLocation(ev.Response.Headers)
            //obs.httpResponseIsFinal = utilsDetermineWhetherHTTPResponseIsFinal(ev.Response.Code)
        }
    };
    /** Returns an array containing observations in random order. */
    WebObservationsContainter.prototype.linearize = function () {
        var output = [];
        for (var _i = 0, _a = this.dnsLookupFailures; _i < _a.length; _i++) {
            var entry = _a[_i];
            output.push(entry);
        }
        // TODO(bassosimone): should we include successes here? Wouldn't it be
        // actually redundant to include them into the returned value?
        {
            var source = this.knownTcpEndpoints;
            for (var _b = 0, _c = Object.keys(source); _b < _c.length; _b++) {
                var key = _c[_b];
                if (!source.hasOwnProperty(key)) {
                    continue;
                }
                var value = source[key]; // we know it's a number!
                output.push(value);
            }
        }
        return output;
    };
    return WebObservationsContainter;
}());
exports.WebObservationsContainter = WebObservationsContainter;
/** Returns only WebObservations using the given target tag. */
function filterByTargetTag(input, tag) {
    var output = [];
    for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
        var entry = input_1[_i];
        if (entry.tagTarget === tag) {
            output.push(entry);
        }
    }
    return output;
}
exports.filterByTargetTag = filterByTargetTag;
/**
 * Complex sorting of linear observations. We first divide the input
 * list in groups identified by their type such that all the equal types
 * are in a group. Within each group, we then sort by failure so that
 * null appears before actual failures.
 */
function sortByTypeAndFailure(input) {
    // Utility function to reduce a null failure to an empty string
    function failurefilter(input) {
        if (input === null) {
            return "";
        }
        return input;
    }
    // Utility function to map the undefined transaction ID to the 0 value
    function txidfilter(input) {
        if (input === undefined) {
            return 0;
        }
        return input;
    }
    // TODO(bassosimone): write unit tests for this function!
    input.sort(function (a, b) {
        // sort by Type
        if (a.type > b.type) {
            return -1; // result: [a, b]
        }
        if (a.type < b.type) {
            return 1; // result: [b, a]
        }
        // sort by Failure
        if (failurefilter(a.failure) < failurefilter(b.failure)) {
            return -1; // result: [a, b]
        }
        if (failurefilter(a.failure) > failurefilter(b.failure)) {
            return 1; // result: [b, a]
        }
        // undocumented but important to have consistent ordering
        // which helps when running unit tests. This sorting is such
        // that transactions with undefined ID sort as last.
        return txidfilter(b.transactionId) - txidfilter(a.transactionId);
    });
}
exports.sortByTypeAndFailure = sortByTypeAndFailure;
