/** Representation of binary data. */
export class BinaryData {
	data: string = ""
	format: string = ""
}

/** Either a string or binary data encoded as base64. */
type MaybeBinaryData = BinaryData | string

/** Observation of an I/O event. */
export class NetworkEvent {
	/** Typically this is the remote address. */
	address?: string

	/** Whether the operation succeded. */
	failure: string | null = null

	/** Number of bytes received or sent by this operation. */
	num_bytes?: number

	/** Name of the operation. */
	operation: string = ""

	/** Protocol used by this operation, e.g., "tcp". */
	proto?: string

	/** Time when we started the operation. */
	t0?: number

	/** Time when we finished the operation. */
	t: number = 0

	/** Optional tags annotating this observation. */
	tags?: string[] | null

	/** ID of the transaction to which this observation belongs. */
	transaction_id?: number
}

/** Observation of a DNS lookup operation. */
export class DnsLookupResult {
	/** DNS anwers. */
	answers: DnsAnswer[] | null = null

	/** DNS engine being used. */
	engine: string = ""

	/** Whether the DNS lookup succeded. */
	failure: string | null = null

	/** Getaddrinfo return code, if available. */
	getaddrinfo_error?: number

	/** Hostname we used in the query. */
	hostname: string = ""

	/** Query type (e.g., A, AAAA). */
	query_type: string = ""

	/** Base64-encoded raw DNS response, if available. */
	raw_response?: string

	/** Response's return code, if available. */
	rcode?: number

	/** Hostname of the resolver (deprecated and unused). */
	resolver_hostname: string | null = null

	/** Port of the resolver (deprecated and unused). */
	resolver_port: string | null = null

	/** Complete address of the resolver endpoint. */
	resolver_address: string = ""

	/** Time when we started the lookup. */
	t0?: number

	/** Time when we finished the lookup. */
	t: number = 0

	/** Optional tags annotating this observation. */
	tags?: string[] | null

	/** ID of the transaction to which this observation belongs. */
	transaction_id?: number
}

/** Answer returned by a DNS lookup. */
export class DnsAnswer {
	/** ASN, if known. */
	asn?: number

	/** Organization owning the ASN, if known. */
	as_org_name?: string

	/** Type of answer (e.g., A). */
	answer_type: string = ""

	/** Hostname when answer type is CNAME. */
	hostname?: string

	/** IP address for A answers. */
	ipv4?: string

	/** IP address for AAAA answers. */
	ipv6?: string

	/** Record TTL. */
	TTL: number | null = null
}

/** Observation of an HTTP round trip. */
export class HttpRequestResult {
	/** Network used by the round-trip (e.g., tcp) */
	network: string = ""

	/** Remote address and port. */
	address: string = ""

	/** Negotiated TLS protocol (e.g., h3). */
	alpn?: string

	/** Whether the HTTP round trip succeded. */
	failure: string | null = null

	/** The request we sent. */
	request: HttpRequest = new HttpRequest()

	/** The response we received, */
	response: HttpResponse = new HttpResponse()

	/** Time when we started the HTTP round trip. */
	t0?: number

	/** Time when we finished the HTTP round trip. */
	t: number = 0

	/** Optional tags annotating this observation. */
	tags?: string[] | null

	/** ID of the transaction to which this observation belongs. */
	transaction_id?: number
}

/** Information regarding using HTTP over tor. */
class HttpTor {
	exit_ip: string | null = null
	exit_name: string | null = null
	is_tor: boolean = false
}

/** Information about a given HTTP header. */
type HttpHeader = [MaybeBinaryData, MaybeBinaryData]

/** Map containing the first value for each header key. */
type HttpHeaderMap = { [key: string]: MaybeBinaryData }

/** Summary of the HTTP request. */
class HttpRequest {
	/** The request body. */
	body: MaybeBinaryData = ""

	/** Whether the request body is truncated. */
	body_is_truncated: boolean = false

	/** List of headers. */
	headers_list: HttpHeader[] = []

	/** Map from header key to first header with the given key. */
	headers: HttpHeaderMap = {}

	/** Request method. */
	method: string = ""

	/** Information about tor usage (unused and deprecated). */
	tor: HttpTor = new HttpTor()

	/** Transport protocol being used. */
	x_transport: string = ""

	/** Request URL. */
	url: string = ""
}

/** Summary of the HTTP response. */
class HttpResponse {
	/** The response body. */
	body: MaybeBinaryData = ""

	/** Whether the response body is truncated. */
	body_is_truncated: boolean = false

	/** Response status code, e.g., 200. */
	code: number = 0

	/** List of headers. */
	headers_list: HttpHeader[] = []

	/** Map from header key to first header with the given key. */
	headers: HttpHeaderMap = {}
}

/** Observation of a TCP connect operation. */
export class TcpConnectResult {
	/** Remote IP addres.s */
	ip: string = ""

	/** Remote TCP port. */
	port: number = 0

	/** Status of the operation. */
	status: TcpConnectStatus = new TcpConnectStatus()

	/** Time when we started connecting. */
	t0?: number

	/** Time when we finished connecting. */
	t: number = 0

	/** Optional tags annotating this observation. */
	tags?: string[] | null

	/** ID of the transaction to which this observation belongs. */
	transaction_id?: number
}

/** Status of a TCP connect operation. */
export class TcpConnectStatus {
	/** Whether this endpoint is blocked (mostly unused). */
	blocked?: boolean | null

	/** Whether the TCP connect succeded. */
	failure: string | null = null

	/* Boolean flag indicated whether there was success. */
	success: boolean = false
}

export class TlsHandshakeResult {
	/** Network used by the handshake (e.g., tcp) */
	network: string = ""

	/** Remote address and port. */
	address: string = ""

	/** Negotiated TLS cipher suite. */
	cipher_suite: string = ""

	/** Whether the TLS or QUIC handshake succeded. */
	failure: string | null = null

	/** Socket error that occurred, if any. */
	so_error?: string | null = null

	/** Protocol negotiated using ALPN. */
	negotiated_protocol: string = ""

	/** Whether TLS verification has been disabled. */
	no_tls_verify: boolean = false

	/** Certificates sent by the TLS server. */
	peer_certificates: BinaryData[] | null = null

	/** Name sent using the SNI extension. */
	server_name: string = ""

	/** Time when we started the TLS/QUIC handshake. */
	t0?: number

	/** Time when we finished the TLS/QUIC handshake. */
	t: number = 0

	/** Optional tags annotating this observation. */
	tags?: string[] | null

	/** TLS version we're using. */
	tls_version: string = ""

	/** ID of the transaction to which this observation belongs. */
	transaction_id?: number
}

/** This is the format with which we archive observations. */
export class ArchivalObservations {
	/** I/O events. */
	network_events: NetworkEvent[] | null = null

	/** DNS queries results. */
	queries: DnsLookupResult[] | null = null

	/** HTTP requests results. */
	requests: HttpRequestResult[] | null = null

	/** TCP connects results. */
	tcp_connect: TcpConnectResult[] | null = null

	/** TLS handshakes results. */
	tls_handshakes: TlsHandshakeResult[] | null = null

	/** QUIC handshakes results. */
	quic_handshakes: TlsHandshakeResult[] | null = null
}
