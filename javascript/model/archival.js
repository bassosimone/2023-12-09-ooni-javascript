"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArchivalObservations = exports.TlsHandshakeResult = exports.TcpConnectStatus = exports.TcpConnectResult = exports.HttpRequestResult = exports.DnsAnswer = exports.DnsLookupResult = exports.NetworkEvent = exports.BinaryData = void 0;
/** Representation of binary data. */
var BinaryData = /** @class */ (function () {
    function BinaryData() {
        this.data = "";
        this.format = "";
    }
    return BinaryData;
}());
exports.BinaryData = BinaryData;
/** Observation of an I/O event. */
var NetworkEvent = /** @class */ (function () {
    function NetworkEvent() {
        /** Whether the operation succeded. */
        this.failure = null;
        /** Name of the operation. */
        this.operation = "";
        /** Time when we finished the operation. */
        this.t = 0;
    }
    return NetworkEvent;
}());
exports.NetworkEvent = NetworkEvent;
/** Observation of a DNS lookup operation. */
var DnsLookupResult = /** @class */ (function () {
    function DnsLookupResult() {
        /** DNS anwers. */
        this.answers = null;
        /** DNS engine being used. */
        this.engine = "";
        /** Whether the DNS lookup succeded. */
        this.failure = null;
        /** Hostname we used in the query. */
        this.hostname = "";
        /** Query type (e.g., A, AAAA). */
        this.query_type = "";
        /** Hostname of the resolver (deprecated and unused). */
        this.resolver_hostname = null;
        /** Port of the resolver (deprecated and unused). */
        this.resolver_port = null;
        /** Complete address of the resolver endpoint. */
        this.resolver_address = "";
        /** Time when we finished the lookup. */
        this.t = 0;
    }
    return DnsLookupResult;
}());
exports.DnsLookupResult = DnsLookupResult;
/** Answer returned by a DNS lookup. */
var DnsAnswer = /** @class */ (function () {
    function DnsAnswer() {
        /** Type of answer (e.g., A). */
        this.answer_type = "";
        /** Record TTL. */
        this.TTL = null;
    }
    return DnsAnswer;
}());
exports.DnsAnswer = DnsAnswer;
/** Observation of an HTTP round trip. */
var HttpRequestResult = /** @class */ (function () {
    function HttpRequestResult() {
        /** Network used by the round-trip (e.g., tcp) */
        this.network = "";
        /** Remote address and port. */
        this.address = "";
        /** Whether the HTTP round trip succeded. */
        this.failure = null;
        /** The request we sent. */
        this.request = new HttpRequest();
        /** The response we received, */
        this.response = new HttpResponse();
        /** Time when we finished the HTTP round trip. */
        this.t = 0;
    }
    return HttpRequestResult;
}());
exports.HttpRequestResult = HttpRequestResult;
/** Information regarding using HTTP over tor. */
var HttpTor = /** @class */ (function () {
    function HttpTor() {
        this.exit_ip = null;
        this.exit_name = null;
        this.is_tor = false;
    }
    return HttpTor;
}());
/** Summary of the HTTP request. */
var HttpRequest = /** @class */ (function () {
    function HttpRequest() {
        /** The request body. */
        this.body = "";
        /** Whether the request body is truncated. */
        this.body_is_truncated = false;
        /** List of headers. */
        this.headers_list = [];
        /** Map from header key to first header with the given key. */
        this.headers = {};
        /** Request method. */
        this.method = "";
        /** Information about tor usage (unused and deprecated). */
        this.tor = new HttpTor();
        /** Transport protocol being used. */
        this.x_transport = "";
        /** Request URL. */
        this.url = "";
    }
    return HttpRequest;
}());
/** Summary of the HTTP response. */
var HttpResponse = /** @class */ (function () {
    function HttpResponse() {
        /** The response body. */
        this.body = "";
        /** Whether the response body is truncated. */
        this.body_is_truncated = false;
        /** Response status code, e.g., 200. */
        this.code = 0;
        /** List of headers. */
        this.headers_list = [];
        /** Map from header key to first header with the given key. */
        this.headers = {};
    }
    return HttpResponse;
}());
/** Observation of a TCP connect operation. */
var TcpConnectResult = /** @class */ (function () {
    function TcpConnectResult() {
        /** Remote IP addres.s */
        this.ip = "";
        /** Remote TCP port. */
        this.port = 0;
        /** Status of the operation. */
        this.status = new TcpConnectStatus();
        /** Time when we finished connecting. */
        this.t = 0;
    }
    return TcpConnectResult;
}());
exports.TcpConnectResult = TcpConnectResult;
/** Status of a TCP connect operation. */
var TcpConnectStatus = /** @class */ (function () {
    function TcpConnectStatus() {
        /** Whether the TCP connect succeded. */
        this.failure = null;
        /* Boolean flag indicated whether there was success. */
        this.success = false;
    }
    return TcpConnectStatus;
}());
exports.TcpConnectStatus = TcpConnectStatus;
var TlsHandshakeResult = /** @class */ (function () {
    function TlsHandshakeResult() {
        /** Network used by the handshake (e.g., tcp) */
        this.network = "";
        /** Remote address and port. */
        this.address = "";
        /** Negotiated TLS cipher suite. */
        this.cipher_suite = "";
        /** Whether the TLS or QUIC handshake succeded. */
        this.failure = null;
        /** Socket error that occurred, if any. */
        this.so_error = null;
        /** Protocol negotiated using ALPN. */
        this.negotiated_protocol = "";
        /** Whether TLS verification has been disabled. */
        this.no_tls_verify = false;
        /** Certificates sent by the TLS server. */
        this.peer_certificates = null;
        /** Name sent using the SNI extension. */
        this.server_name = "";
        /** Time when we finished the TLS/QUIC handshake. */
        this.t = 0;
        /** TLS version we're using. */
        this.tls_version = "";
    }
    return TlsHandshakeResult;
}());
exports.TlsHandshakeResult = TlsHandshakeResult;
/** This is the format with which we archive observations. */
var ArchivalObservations = /** @class */ (function () {
    function ArchivalObservations() {
        /** I/O events. */
        this.network_events = null;
        /** DNS queries results. */
        this.queries = null;
        /** HTTP requests results. */
        this.requests = null;
        /** TCP connects results. */
        this.tcp_connect = null;
        /** TLS handshakes results. */
        this.tls_handshakes = null;
        /** QUIC handshakes results. */
        this.quic_handshakes = null;
    }
    return ArchivalObservations;
}());
exports.ArchivalObservations = ArchivalObservations;
