import { ArchivalObservations, DnsLookupResult, HttpRequestResult, TcpConnectResult, TlsHandshakeResult } from "../../model/archival"

/** The last operation in a WebOservation is DNS lookup. */
const TypeDNSLookup = 0

/** The last operation in a WebOservation is TCP connect. */
const TypeTCPConnect = 1

/** The last operation in a WebOservation is TLS handshake. */
const TypeTLSHandshake = 2

/** The last operation in a WebOservation is HTTP round trip. */
const TypeHTTPRoundTrip = 3

// TODO(bassosimone): implement linear analysis and sorting using the
// custom sorting functionlity in Array.prototype.sort.

/** Observation of a web measurement including DNS, TCP, TLS, QUIC, and HTTP. */
export class WebObservation {
	// Common fields

	/** The tag containing the depth of the request chain. */
	// TODO(basosimone): implement
	//tagDepth?: number

	/** The type of this web observation. */
	type: number = 0

	/** Whether there was a failure. */
	failure: string | null = null

	/** Transaction ID of this observation. */
	transactionId?: number

	/** The tag containing information on whether we're fetching a body. */
	// TODO(basosimone): implement
	//tagFethBody?: boolean

	/** The tag containing the target we're measuring. */
	tagTarget: string | null = null

	// DNS fields

	/** The DNS transaction ID of this observation. */
	dnsTransactionId?: number

	/** The domain we're resolving. */
	dnsDomain?: string

	/** The DNS lookup failure we did see. */
	dnsLookupFailure?: string | null

	/** The DNS query type. */
	dnsQueryType?: string

	/** The DNS engine being used. */
	dnsEngine?: string

	// IP address fields

	/** The IP address that this observation is about. */
	ipAddress?: string

	// endpoint fields

	/** Transaction ID of this endpoint. */
	endpointTransactionId?: number

	/** Endpoint protocol, e.g., tcp. */
	endpointProto?: string

	/** Endpoint port number. */
	endpointPort?: string

	/** Endpoint address including IP address and port. */
	endpointAddress?: string

	// TCP fields

	/** Failure when performing a TCP connect. */
	tcpConnectFailure?: string | null

	// TLS fields

	/** Failure when handshaking. */
	tlsHandshakeFailure?: string | null

	/** SNI we used. */
	tlsServerName?: string

	// HTTP fields

	/** Failure when performing HTTP round trip. */
	httpFailure?: string | null

	/** Request URL. */
	httpRequestURL?: string

	/** Status code. */
	httpResponseStatusCode?: number
}

/** Utility function to get the target= tag given the list of tags. */
function getTargetTag(tags?: string[] | null): string | null {
    for (const tag of (tags || [])) {
        if (tag.indexOf("target=", 0) !== 0) {
            continue
        }
        return tag.replace(/^target=/, "")
    }
    return null
}

/** Utility function to join an address and a port. */
function netJoinHostPort(address: string, port: string): string {
	if (address.indexOf(":") >= 0) {
		return `[${address}]:${port}`
	}
	return `${address}:${port}`
}


/** Map between a transaction ID and the corresponding observation. */
export type TransactionIdToWebObservation = { [key: number]: WebObservation }

/** Map between an IP address and a WebObservation. */
type IpAddressToWebObservation = { [key: string]: WebObservation }

/** Container for organizing WebObservation structs. */
export class WebObservationsContainter {
	/** Failed DNS lookups. */
	dnsLookupFailures: WebObservation[] = []

	/** Successful DNS lookups. */
	dnsLookupSuccesses: WebObservation[] = []

	/** Observations pertainting to known TCP endpoints. */
	knownTcpEndpoints: TransactionIdToWebObservation = {}

	/** Mapping between an IP address and the web observation discovering it. */
	private knownIpAddresses: IpAddressToWebObservation = {}

	/** Load from archival observations. */
	ingestArchivalObservations(ao: ArchivalObservations) {
		this.ingestDnsLookupEvents(...(ao.queries) || [])
		this.ingestTcpConnectEvents(...(ao.tcp_connect) || [])
		this.ingestTlsHandshakeEvents(...(ao.tls_handshakes) || [])
		this.ingestHttpRoundTripEvents(...(ao.requests) || [])
	}

	/** Loads DNS lookup events. */
	ingestDnsLookupEvents(...events: DnsLookupResult[]) {
		this.ingestDnsLookupFailures(...events)
		this.ingestDnsLookupSuccesses(...events)
	}

	private ingestDnsLookupFailures(...events: DnsLookupResult[]) {
		for (const event of events) {
			// skip all the succesful queries
			if (event.failure === undefined || event.failure === null) {
				continue
			}

			// create record
			const obs = new WebObservation()
			obs.type = TypeDNSLookup
			obs.failure = event.failure
			obs.transactionId = event.transaction_id
			obs.tagTarget = getTargetTag(event.tags)
			obs.dnsTransactionId = event.transaction_id
			obs.dnsDomain = event.hostname
			obs.dnsLookupFailure = event.failure
			obs.dnsQueryType = event.query_type
			obs.dnsEngine = event.engine

			// TODO(bassosimone): add these fields
			// TagDepth: utilsExtractTagDepth(ev.Tags),

			// add record
			this.dnsLookupFailures.push(obs)
		}
	}

	private ingestDnsLookupSuccesses(...events: DnsLookupResult[]) {
		for (const event of events) {
			// skip all the failed queries
			if (event.failure === undefined || event.failure !== null) {
				continue
			}

			// walk through the answers
			for (const answer of (event.answers || [])) {
				let address = ""

				// only include the cases where we resolved an address
				if (answer.answer_type === "A") {
					address = answer.ipv4 || ""
				} else if (answer.answer_type === "AAAA") {
					address = answer.ipv6 || ""
				} else {
					continue
				}

				// create the record
				const obs = new WebObservation()
				obs.type = TypeDNSLookup
				obs.failure = null
				obs.transactionId = event.transaction_id
				obs.tagTarget = getTargetTag(event.tags)
				obs.dnsTransactionId = event.transaction_id
				obs.dnsDomain = event.hostname
				obs.dnsLookupFailure = null
				obs.dnsQueryType = event.query_type
				obs.dnsEngine = event.engine
				obs.ipAddress = address

				// TODO(bassosimone): add these fields
				//DNSResolvedAddrs: optional.Some(addrs),
				//TagDepth:         utilsExtractTagDepth(ev.Tags),

				// add record
				this.dnsLookupSuccesses.push(obs)

				// store the first lookup that resolved this address
				if (this.knownIpAddresses[address] !== undefined) {
					continue
				}
				this.knownIpAddresses[address] = obs
			}
		}
	}

	/** Loads TCP connect events. */
	ingestTcpConnectEvents(...events: TcpConnectResult[]) {
		for (const event of events) {
			// make sure we have a transaction ID
			if (event.transaction_id === undefined) {
				continue
			}
			const txid = event.transaction_id

			// create or fetch a record
			let base = this.knownIpAddresses[event.ip]
			if (base === undefined) {
				base = new WebObservation()
				base.ipAddress = event.ip
			}

			// clone the record because the same IP address MAY belong
			// to multiple endpoints across the same measurement
			//
			// while there also fill endpoint specific info
			const obs = new WebObservation()
			obs.type = TypeTCPConnect
			obs.failure = event.status.failure
			obs.transactionId = txid
			obs.tagTarget = getTargetTag(event.tags)
			obs.dnsTransactionId = base.dnsTransactionId
			obs.dnsDomain = base.dnsDomain
			obs.dnsLookupFailure = base.dnsLookupFailure
			obs.ipAddress = base.ipAddress
			obs.endpointTransactionId = event.transaction_id
			obs.endpointProto = "tcp"
			obs.endpointPort = `${event.port}`
			obs.endpointAddress = netJoinHostPort(event.ip, `${event.port}`)
			obs.tcpConnectFailure = event.status.failure

			// TODO(bassosimone): add these fields
			//DNSResolvedAddrs:      base.DNSResolvedAddrs,
			//IPAddressASN:          base.IPAddressASN,
			//IPAddressBogon:        base.IPAddressBogon,
			//TagDepth:              utilsExtractTagDepth(ev.Tags),
			//TagFetchBody:          utilsExtractTagFetchBody(ev.Tags),

			// register the observation
			this.knownTcpEndpoints[txid] = obs
		}
	}

	/** Loads TLS handshake events. */
	ingestTlsHandshakeEvents(...events: TlsHandshakeResult[]) {
		for (const event of events) {
			// make sure we have a transaction ID
			if (event.transaction_id === undefined) {
				continue
			}
			const txid = event.transaction_id

			// find the corresponding obs
			const obs = this.knownTcpEndpoints[txid]
			if (obs === undefined) {
				continue
			}

			// update the record
			obs.type = TypeTLSHandshake
			obs.failure = event.failure
			obs.tlsHandshakeFailure = event.failure
			obs.tlsServerName = event.server_name
		}
	}

	/** Loads HTTP round trip events. */
	ingestHttpRoundTripEvents(...events: HttpRequestResult[]) {
		for (const event of events) {
			// make sure we have a transaction ID
			if (event.transaction_id === undefined) {
				continue
			}
			const txid = event.transaction_id

			// find the corresponding obs
			const obs = this.knownTcpEndpoints[txid]
			if (obs === undefined) {
				continue
			}

			// start updating record
			obs.type = TypeHTTPRoundTrip
			obs.failure = event.failure
			obs.httpRequestURL = event.request.url
			obs.httpFailure = event.failure

			// consider the response authoritative only in case of success
			if (event.failure === undefined || event.failure !== null) {
				continue
			}
			obs.httpResponseStatusCode = event.response.code

			// TODO(bassosimone): add these fields
			//obs.httpResponseBodyLength = optional.Some(int64(len(ev.Response.Body)))
			//obs.httpResponseBodyIsTruncated = optional.Some(ev.Request.BodyIsTruncated)
			//obs.httpResponseHeadersKeys = utilsExtractHTTPHeaderKeys(ev.Response.Headers)
			//obs.httpResponseTitle = optional.Some(measurexlite.WebGetTitle(string(ev.Response.Body)))
			//obs.httpResponseLocation = utilsExtractHTTPLocation(ev.Response.Headers)
			//obs.httpResponseIsFinal = utilsDetermineWhetherHTTPResponseIsFinal(ev.Response.Code)
		}
	}
}
