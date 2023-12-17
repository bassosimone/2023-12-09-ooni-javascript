/** An option for DnsLookupUpdValue's constructor. */
export type DnsLookupUdpOption = (_: DnsLookupUdpValue) => void

/** Sets the tags. */
export function dnsLookupUdpOptionTags(...tags: string[]): DnsLookupUdpOption {
	return function (value: DnsLookupUdpValue) {
		value.tags = tags
	}
}

/** Value of the dns_lookup_udp node. */
export class DnsLookupUdpValue {
	/** The domain to resolve. */
	domain: string

	/** The register where to write the output. */
	output: string

	/** The DNS-over-UDP resolver endpoint to use (e.g., 127.0.0.1:53, [::1]:53). */
	resolver: string

	/** Optional tags for results produced by this node. */
	tags: string[] | null

	constructor(domain: string, output: string, resolver: string, ...options: DnsLookupUdpOption[]) {
		this.domain = domain
		this.output = output
		this.resolver = resolver
		this.tags = null
		for (const option of options) {
			option(this)
		}
	}
}
