"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.TestKeys = exports.experimentVersion = exports.experimentName = void 0;
var dsl_1 = require("../../dsl");
var time_1 = require("../../../golang/time");
var archival_1 = require("../../model/archival");
var micropipeline_1 = require("../../micropipeline");
/** Returns the signal experiment name. */
function experimentName() {
    return "signal";
}
exports.experimentName = experimentName;
/** Returns the signal experiment version. */
function experimentVersion() {
    return "0.3.0";
}
exports.experimentVersion = experimentVersion;
var signalCA = "-----BEGIN CERTIFICATE-----\nMIID7zCCAtegAwIBAgIJAIm6LatK5PNiMA0GCSqGSIb3DQEBBQUAMIGNMQswCQYD\nVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5j\naXNjbzEdMBsGA1UECgwUT3BlbiBXaGlzcGVyIFN5c3RlbXMxHTAbBgNVBAsMFE9w\nZW4gV2hpc3BlciBTeXN0ZW1zMRMwEQYDVQQDDApUZXh0U2VjdXJlMB4XDTEzMDMy\nNTIyMTgzNVoXDTIzMDMyMzIyMTgzNVowgY0xCzAJBgNVBAYTAlVTMRMwEQYDVQQI\nDApDYWxpZm9ybmlhMRYwFAYDVQQHDA1TYW4gRnJhbmNpc2NvMR0wGwYDVQQKDBRP\ncGVuIFdoaXNwZXIgU3lzdGVtczEdMBsGA1UECwwUT3BlbiBXaGlzcGVyIFN5c3Rl\nbXMxEzARBgNVBAMMClRleHRTZWN1cmUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw\nggEKAoIBAQDBSWBpOCBDF0i4q2d4jAXkSXUGpbeWugVPQCjaL6qD9QDOxeW1afvf\nPo863i6Crq1KDxHpB36EwzVcjwLkFTIMeo7t9s1FQolAt3mErV2U0vie6Ves+yj6\ngrSfxwIDAcdsKmI0a1SQCZlr3Q1tcHAkAKFRxYNawADyps5B+Zmqcgf653TXS5/0\nIPPQLocLn8GWLwOYNnYfBvILKDMItmZTtEbucdigxEA9mfIvvHADEbteLtVgwBm9\nR5vVvtwrD6CCxI3pgH7EH7kMP0Od93wLisvn1yhHY7FuYlrkYqdkMvWUrKoASVw4\njb69vaeJCUdU+HCoXOSP1PQcL6WenNCHAgMBAAGjUDBOMB0GA1UdDgQWBBQBixjx\nP/s5GURuhYa+lGUypzI8kDAfBgNVHSMEGDAWgBQBixjxP/s5GURuhYa+lGUypzI8\nkDAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4IBAQB+Hr4hC56m0LvJAu1R\nK6NuPDbTMEN7/jMojFHxH4P3XPFfupjR+bkDq0pPOU6JjIxnrD1XD/EVmTTaTVY5\niOheyv7UzJOefb2pLOc9qsuvI4fnaESh9bhzln+LXxtCrRPGhkxA1IMIo3J/s2WF\n/KVYZyciu6b4ubJ91XPAuBNZwImug7/srWvbpk0hq6A6z140WTVSKtJG7EP41kJe\n/oF4usY5J7LPkxK3LWzMJnb5EIJDmRvyH8pyRwWg6Qm6qiGFaI4nL8QU4La1x2en\n4DGXRaLMPRwjELNgQPodR38zoCMuA8gHZfZYYoZ7D7Q1wNUiVHcxuFrEeBaYJbLE\nrwLV\n-----END CERTIFICATE-----";
var signalCANew = "\n-----BEGIN CERTIFICATE-----\nMIIF2zCCA8OgAwIBAgIUAMHz4g60cIDBpPr1gyZ/JDaaPpcwDQYJKoZIhvcNAQEL\nBQAwdTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcT\nDU1vdW50YWluIFZpZXcxHjAcBgNVBAoTFVNpZ25hbCBNZXNzZW5nZXIsIExMQzEZ\nMBcGA1UEAxMQU2lnbmFsIE1lc3NlbmdlcjAeFw0yMjAxMjYwMDQ1NTFaFw0zMjAx\nMjQwMDQ1NTBaMHUxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYw\nFAYDVQQHEw1Nb3VudGFpbiBWaWV3MR4wHAYDVQQKExVTaWduYWwgTWVzc2VuZ2Vy\nLCBMTEMxGTAXBgNVBAMTEFNpZ25hbCBNZXNzZW5nZXIwggIiMA0GCSqGSIb3DQEB\nAQUAA4ICDwAwggIKAoICAQDEecifxMHHlDhxbERVdErOhGsLO08PUdNkATjZ1kT5\n1uPf5JPiRbus9F4J/GgBQ4ANSAjIDZuFY0WOvG/i0qvxthpW70ocp8IjkiWTNiA8\n1zQNQdCiWbGDU4B1sLi2o4JgJMweSkQFiyDynqWgHpw+KmvytCzRWnvrrptIfE4G\nPxNOsAtXFbVH++8JO42IaKRVlbfpe/lUHbjiYmIpQroZPGPY4Oql8KM3o39ObPnT\no1WoM4moyOOZpU3lV1awftvWBx1sbTBL02sQWfHRxgNVF+Pj0fdDMMFdFJobArrL\nVfK2Ua+dYN4pV5XIxzVarSRW73CXqQ+2qloPW/ynpa3gRtYeGWV4jl7eD0PmeHpK\nOY78idP4H1jfAv0TAVeKpuB5ZFZ2szcySxrQa8d7FIf0kNJe9gIRjbQ+XrvnN+ZZ\nvj6d+8uBJq8LfQaFhlVfI0/aIdggScapR7w8oLpvdflUWqcTLeXVNLVrg15cEDwd\nlV8PVscT/KT0bfNzKI80qBq8LyRmauAqP0CDjayYGb2UAabnhefgmRY6aBE5mXxd\nbyAEzzCS3vDxjeTD8v8nbDq+SD6lJi0i7jgwEfNDhe9XK50baK15Udc8Cr/ZlhGM\njNmWqBd0jIpaZm1rzWA0k4VwXtDwpBXSz8oBFshiXs3FD6jHY2IhOR3ppbyd4qRU\npwIDAQABo2MwYTAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0TAQH/BAUwAwEB/zAdBgNV\nHQ4EFgQUtfNLxuXWS9DlgGuMUMNnW7yx83EwHwYDVR0jBBgwFoAUtfNLxuXWS9Dl\ngGuMUMNnW7yx83EwDQYJKoZIhvcNAQELBQADggIBABUeiryS0qjykBN75aoHO9bV\nPrrX+DSJIB9V2YzkFVyh/io65QJMG8naWVGOSpVRwUwhZVKh3JVp/miPgzTGAo7z\nhrDIoXc+ih7orAMb19qol/2Ha8OZLa75LojJNRbZoCR5C+gM8C+spMLjFf9k3JVx\ndajhtRUcR0zYhwsBS7qZ5Me0d6gRXD0ZiSbadMMxSw6KfKk3ePmPb9gX+MRTS63c\n8mLzVYB/3fe/bkpq4RUwzUHvoZf+SUD7NzSQRQQMfvAHlxk11TVNxScYPtxXDyiy\n3Cssl9gWrrWqQ/omuHipoH62J7h8KAYbr6oEIq+Czuenc3eCIBGBBfvCpuFOgckA\nXXE4MlBasEU0MO66GrTCgMt9bAmSw3TrRP12+ZUFxYNtqWluRU8JWQ4FCCPcz9pg\nMRBOgn4lTxDZG+I47OKNuSRjFEP94cdgxd3H/5BK7WHUz1tAGQ4BgepSXgmjzifF\nT5FVTDTl3ZnWUVBXiHYtbOBgLiSIkbqGMCLtrBtFIeQ7RRTb3L+IE9R0UB0cJB3A\nXbf1lVkOcmrdu2h8A32aCwtr5S1fBF1unlG7imPmqJfpOMWa8yIF/KWVm29JAPq8\nLrsybb0z5gg8w7ZblEuB9zOW9M3l60DXuJO6l7g+deV6P96rv2unHS8UlvWiVWDy\n9qfgAJizyy3kqM4lOwBH\n-----END CERTIFICATE-----";
function generateDslForHTTPS(builder, domain, tag) {
    // properly transform the tag into a key=value format
    tag = "target=".concat(tag);
    // obtain IP addrs from the domain name
    var addrs = builder.getaddrinfo(domain, (0, dsl_1.getaddrinfoOptionTags)(tag));
    // map addrs to endpoints
    var endpoints = builder.makeEndpoints("443", addrs);
    // establish TCP connections
    var tcpConnections = builder.tcpConnect(endpoints, (0, dsl_1.tcpConnectOptionTags)(tag));
    // perform TLS handshakes with the custom root CAs
    var tlsConnections = builder.tlsHandshake(domain, ["h2", "http/1.1"], tcpConnections, (0, dsl_1.tlsHandshakeOptionRootCAs)(signalCA, signalCANew));
    // make sure we use juse a single connection for the HTTP round trip
    var firstConn = builder.takeN(1, tlsConnections);
    // perform HTTP round trips
    builder.httpRoundTrip(domain, firstConn);
}
function generateDSLForUptime(builder) {
    // obtain IP adds from the domain name
    var addrs = builder.getaddrinfo("uptime.signal.org");
    // drop the results since we don't need to do anything with them
    builder.drop(addrs);
}
var tagTargetCdsi = "cdsi";
var tagTargetChat = "chat";
var tagTargetSfuVoip = "sfu_voip";
var tagTargetStorage = "storage";
function measure() {
    // create the builder
    var builder = new dsl_1.Builder();
    // build DSL for HTTPS
    generateDslForHTTPS(builder, "cdsi.signal.org", tagTargetCdsi);
    generateDslForHTTPS(builder, "chat.signal.org", tagTargetChat);
    generateDslForHTTPS(builder, "sfu.voip.signal.org", tagTargetSfuVoip);
    generateDslForHTTPS(builder, "storage.signal.org", tagTargetStorage);
    // build DSL for uptime.signal.org
    generateDSLForUptime(builder);
    // measure
    var rootNode = builder.buildRootNode();
    var testKeys = (0, dsl_1.run)(rootNode, (0, time_1.now)());
    return testKeys;
}
/** TestKetys contains the signal experiment test keys */
var TestKeys = /** @class */ (function (_super) {
    __extends(TestKeys, _super);
    function TestKeys(obs) {
        // make sure we create the superclass first
        var _this = _super.call(this) || this;
        _this.signal_backend_status = "ok";
        _this.signal_backend_failure = null;
        // then copy from superclass instance
        _this.network_events = obs.network_events;
        _this.queries = obs.queries;
        _this.requests = obs.requests;
        _this.tcp_connect = obs.tcp_connect;
        _this.tls_handshakes = obs.tls_handshakes;
        _this.quic_handshakes = obs.quic_handshakes;
        return _this;
    }
    return TestKeys;
}(archival_1.ArchivalObservations));
exports.TestKeys = TestKeys;
function analyzeWithTag(testKeys, linear, tag) {
    if (testKeys.signal_backend_failure !== null && testKeys.signal_backend_failure !== undefined) {
        return;
    }
    // only keep observations relevant for the current tag we're analyzing
    var filtered = (0, micropipeline_1.filterByTargetTag)(linear, tag);
    // sort such that HTTP and successes bubble up first
    (0, micropipeline_1.sortByTypeAndFailure)(filtered);
    // if there's nothing to analyze, do nothing (is this a bug?!)
    if (filtered.length <= 0) {
        return;
    }
    // the first entry should be the most important operation of the measurement
    // tyically HTTP in the successful case and a success if possible
    var first = filtered[0];
    if (first.failure === undefined || first.failure === null) {
        return;
    }
    // if there is a failure, it means we were not able to reach the HTTP and
    // success state for this tag, so let's mark the backend as blocked
    testKeys.signal_backend_status = "blocked";
    testKeys.signal_backend_failure = first.failure;
}
function analyze(testKeys) {
    // create the linear analysis to use as the starting point for determining
    // whether the signal backend has been blocked or not
    var container = new micropipeline_1.WebObservationsContainter();
    container.ingestArchivalObservations(testKeys);
    var linear = container.linearize();
    // analyze each signal-backend service that we measure
    analyzeWithTag(testKeys, linear, tagTargetCdsi);
    analyzeWithTag(testKeys, linear, tagTargetChat);
    analyzeWithTag(testKeys, linear, tagTargetSfuVoip);
    analyzeWithTag(testKeys, linear, tagTargetStorage);
}
/** Runs the signal experiment and returns JSON serialized test keys. */
function run() {
    // measure
    var testKeys = new TestKeys(measure());
    // analyze
    analyze(testKeys);
    // produce result
    return JSON.stringify(testKeys);
}
exports.run = run;
