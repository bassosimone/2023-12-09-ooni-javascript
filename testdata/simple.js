const time = require("golang/time")
const dsl = require("ooni/dsl")

/** Returns the experiment name. */
exports.experimentName = function () {
    return "simple"
}

/** Returns the experiment version. */
exports.experimentVersion = function () {
    return "0.1.0"
}

/** Runs the experiment and return the test keys. */
exports.run = function () {
    const builder = new dsl.Builder()

    const host = "www.youtube.com"

    // duplicated addresses resolved by A into B, C, D...
    builder.teeAddrs(

        // A. deduplicate addresses
        builder.dedupAddrs(
            builder.dnsLookupUdp(host, "1.1.1.1:53", dsl.optionTags("dns_lookup_udp")),
            builder.getaddrinfo(host, dsl.optionTags("dns_getaddrinfo")),
        ),

        // B. 443/tcp pipeline
        function (input) {
            const tcpEndpoint = builder.makeEndpoints("443", input)
            const tcpConn = builder.tcpConnect(tcpEndpoint, dsl.optionTags("tcp_443"))
            const tlsConn = builder.tlsHandshake(host, ["h2", "http1/1"], tcpConn)
            builder.httpRoundTrip(host, builder.takeN(1, tlsConn))
        },

        // C. 80/tcp pipeline
        function (input) {
            const tcpEndpoint = builder.makeEndpoints("443", input)
            const tcpConn = builder.tcpConnect(tcpEndpoint, dsl.optionTags("tcp_443"))
            builder.drop(tcpConn)
        },

        // D. 443/udp pipeline
        function (input) {
            const udpEndpoint = builder.makeEndpoints("443", input)
            const quicConn = builder.quicHandshake(host, ["h3"], udpEndpoint, dsl.optionTags("tcp_443"))
            builder.drop(quicConn)
        },
    )

    const rootNode = builder.buildRootNode()

    console.log(`${JSON.stringify(rootNode, undefined, "  ")}`)

    const begin = time.now()
    console.log(`time before: ${begin}`)

    const observations = dsl.run(rootNode, begin)
    console.log(`time after: ${time.now()}`)

    return JSON.stringify(observations)
}