"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = exports.experimentVersion = exports.experimentName = void 0;
var dsl_1 = require("../../dsl");
var time_1 = require("../../../golang/time");
var micropipeline_1 = require("../../micropipeline");
var richerinput_1 = require("./richerinput");
var generatedsl_1 = require("./generatedsl");
var testkeys_1 = require("./testkeys");
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
function measure(input) {
    // create the DSL
    var rootNode = (0, generatedsl_1.generateDsl)(input);
    // measure
    return new testkeys_1.TestKeys((0, dsl_1.run)(rootNode, (0, time_1.now)()));
}
/* TODO(bassosimone): this function should be a method of TestKeys. */
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
function analyze(input, testKeys) {
    // create the linear analysis to use as the starting point for determining
    // whether the signal backend has been blocked or not
    var container = new micropipeline_1.WebObservationsContainter();
    container.ingestArchivalObservations(testKeys);
    var linear = container.linearize();
    // analyze each signal-backend service that we measure
    for (var _i = 0, _a = input.https_targets; _i < _a.length; _i++) {
        var entry = _a[_i];
        analyzeWithTag(testKeys, linear, entry.targetTag);
    }
    // emit analysis results
    console.log("signal_backend_status: ".concat(testKeys.signal_backend_status));
    console.log("signal_backend_failure: ".concat(testKeys.signal_backend_failure));
}
/** Runs the signal experiment and returns JSON serialized test keys. */
function run() {
    // create default richer input
    var input = (0, richerinput_1.newDefaultRicherInput)();
    // measure
    var testKeys = measure(input);
    // analyze
    analyze(input, testKeys);
    // produce result
    return JSON.stringify(testKeys);
}
exports.run = run;
