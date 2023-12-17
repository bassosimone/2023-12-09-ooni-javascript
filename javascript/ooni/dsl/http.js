"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRoundTripValue = exports.defaultUserAgent = exports.defaultMaxBodySnapshotSize = exports.defaultAcceptLanguage = exports.defaultAccept = exports.httpRoundTripOptionUserAgent = exports.httpRoundTripOptionReferer = exports.httpRoundTripOptionMaxBodySnapshotSize = exports.httpRoundTripOptionAcceptLanguage = exports.httpRoundTripOptionAccept = void 0;
/** Sets the accept header. */
function httpRoundTripOptionAccept(v) {
    return function (value) {
        value.accept = v;
    };
}
exports.httpRoundTripOptionAccept = httpRoundTripOptionAccept;
/** Sets the accept-language header. */
function httpRoundTripOptionAcceptLanguage(v) {
    return function (value) {
        value.accept_language = v;
    };
}
exports.httpRoundTripOptionAcceptLanguage = httpRoundTripOptionAcceptLanguage;
/** Sets max_body_snapshot_size. */
function httpRoundTripOptionMaxBodySnapshotSize(v) {
    return function (value) {
        value.max_body_snapshot_size = (v >= 0) ? v : 0;
    };
}
exports.httpRoundTripOptionMaxBodySnapshotSize = httpRoundTripOptionMaxBodySnapshotSize;
/** Sets the referer header. */
function httpRoundTripOptionReferer(v) {
    return function (value) {
        value.referer = v;
    };
}
exports.httpRoundTripOptionReferer = httpRoundTripOptionReferer;
/** Sets the user-agent header. */
function httpRoundTripOptionUserAgent(v) {
    return function (value) {
        value.user_agent = v;
    };
}
exports.httpRoundTripOptionUserAgent = httpRoundTripOptionUserAgent;
exports.defaultAccept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
exports.defaultAcceptLanguage = "en-US,en;q=0.9";
exports.defaultMaxBodySnapshotSize = 1 << 19;
exports.defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36";
/** Value of the http_round_trip node. */
var HttpRoundTripValue = /** @class */ (function () {
    function HttpRoundTripValue(input, host, output) {
        var options = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            options[_i - 3] = arguments[_i];
        }
        this.accept = exports.defaultAccept;
        this.accept_language = exports.defaultAcceptLanguage;
        this.host = host;
        this.input = input;
        this.max_body_snapshot_size = exports.defaultMaxBodySnapshotSize;
        this.method = "GET";
        this.output = output;
        this.referer = "";
        this.url_path = "/";
        this.user_agent = exports.defaultUserAgent;
        for (var _a = 0, options_1 = options; _a < options_1.length; _a++) {
            var option = options_1[_a];
            option(this);
        }
    }
    return HttpRoundTripValue;
}());
exports.HttpRoundTripValue = HttpRoundTripValue;
