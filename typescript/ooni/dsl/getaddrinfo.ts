/** An option for GetaddrinfoValue's constructor. */
export type GetaddrinfoOption = (_: GetaddrinfoValue) => void

/** Sets the tags. */
export function getaddrinfoOptionTags(...tags: string[]): GetaddrinfoOption {
	return function (value: GetaddrinfoValue) {
		value.tags = tags
	}
}

/** Value of the getaddrinfo node. */
export class GetaddrinfoValue {
	/** The domain to resolve. */
	domain: string

	/** The register where to write output. */
	output: string

	/** Optional tags for the results. */
	tags: string[] | null

	constructor(domain: string, output: string, ...options: GetaddrinfoOption[]) {
		this.domain = domain
		this.output = output
		this.tags = null
		for (const option of options) {
			option(this)
		}
	}
}
