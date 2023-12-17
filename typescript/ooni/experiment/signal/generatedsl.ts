import {
	Builder,
	getaddrinfoOptionTags,
	tcpConnectOptionTags,
	tlsHandshakeOptionRootCAs
} from "../../dsl"

import { RootNode } from "../../dsl/builder"

import { RicherInput } from "./richerinput"

function generateDslForHttps(builder: Builder, domain: string, tag: string, certs: string[]) {
	// properly transform the tag into a key=value format
	tag = `target=${tag}`

	// obtain IP addrs from the domain name
	const addrs = builder.getaddrinfo(domain, getaddrinfoOptionTags(tag))

	// map addrs to endpoints
	const endpoints = builder.makeEndpoints("443", addrs)

	// establish TCP connections
	const tcpConnections = builder.tcpConnect(endpoints, tcpConnectOptionTags(tag))

	// perform TLS handshakes with the custom root CAs
	const tlsConnections = builder.tlsHandshake(
		domain,
		["h2", "http/1.1"],
		tcpConnections,
		tlsHandshakeOptionRootCAs(...certs),
	)

	// make sure we use juse a single connection for the HTTP round trip
	const firstConn = builder.takeN(1, tlsConnections)

	// perform HTTP round trips
	builder.httpRoundTrip(domain, firstConn)
}

function generateDslForUptime(builder: Builder) {
	// obtain IP adds from the domain name
	const addrs = builder.getaddrinfo("uptime.signal.org")

	// drop the results since we don't need to do anything with them
	builder.drop(addrs)
}

/** Generates the DSL for measuring signal using the given richer input. */
export function generateDsl(input: RicherInput): RootNode {
	// create the builder
	const builder = new Builder()

	// build DSL for HTTPS
	for (const entry of input.https_targets) {
		generateDslForHttps(builder, entry.domain, entry.targetTag, input.certs)
	}

	// build DSL for uptime.signal.org
	generateDslForUptime(builder)

	// return the root node
	return builder.buildRootNode()
}
