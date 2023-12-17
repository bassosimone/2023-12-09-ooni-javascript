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
exports.TestKeys = void 0;
var micropipeline_1 = require("../../micropipeline");
var archival_1 = require("../../model/archival");
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
    /** Updates the test keys by selecting the observations for the given tag. */
    TestKeys.prototype.updateForTag = function (linear, tag) {
        if (this.signal_backend_failure !== null && this.signal_backend_failure !== undefined) {
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
        this.signal_backend_status = "blocked";
        this.signal_backend_failure = first.failure;
    };
    return TestKeys;
}(archival_1.ArchivalObservations));
exports.TestKeys = TestKeys;
