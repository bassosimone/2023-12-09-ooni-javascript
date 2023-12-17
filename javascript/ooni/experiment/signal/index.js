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
var richerinput_1 = require("./richerinput");
var generatedsl_1 = require("./generatedsl");
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
// TODO(bassosimone): we should use richer input here
var tagTargetCdsi = "cdsi";
var tagTargetChat = "chat";
var tagTargetSfuVoip = "sfu_voip";
var tagTargetStorage = "storage";
function measure() {
    // TODO(bassosimone): we will need to move richer input to toplevel
    var input = (0, richerinput_1.newDefaultRicherInput)();
    // create the DSL
    var rootNode = (0, generatedsl_1.generateDsl)(input);
    // measure
    return (0, dsl_1.run)(rootNode, (0, time_1.now)());
}
/** TestKeys contains the signal experiment test keys */
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
    // emit analysis results
    console.log("signal_backend_status: ".concat(testKeys.signal_backend_status));
    console.log("signal_backend_failure: ".concat(testKeys.signal_backend_failure));
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
