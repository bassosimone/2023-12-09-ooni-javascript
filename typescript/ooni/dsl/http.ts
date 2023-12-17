/** An option for HttpRoundTripValue's constructor. */
export type HttpRoundTripOption = (_: HttpRoundTripValue) => void

/** Sets the accept header. */
export function httpRoundTripOptionAccept(v: string): HttpRoundTripOption {
	return function (value: HttpRoundTripValue) {
		value.accept = v
	}
}

/** Sets the accept-language header. */
export function httpRoundTripOptionAcceptLanguage(v: string): HttpRoundTripOption {
	return function (value: HttpRoundTripValue) {
		value.accept_language = v
	}
}

/** Sets max_body_snapshot_size. */
export function httpRoundTripOptionMaxBodySnapshotSize(v: number): HttpRoundTripOption {
	return function (value: HttpRoundTripValue) {
		value.max_body_snapshot_size = (v >= 0) ? v : 0
	}
}

/** Sets the referer header. */
export function httpRoundTripOptionReferer(v: string): HttpRoundTripOption {
	return function (value: HttpRoundTripValue) {
		value.referer = v
	}
}

/** Sets the user-agent header. */
export function httpRoundTripOptionUserAgent(v: string): HttpRoundTripOption {
	return function (value: HttpRoundTripValue) {
		value.user_agent = v
	}
}

export const defaultAccept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"

export const defaultAcceptLanguage = "en-US,en;q=0.9"

export const defaultMaxBodySnapshotSize = 1 << 19

export const defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"

/** Value of the http_round_trip node. */
export class HttpRoundTripValue {
	accept: string
	accept_language: string
	host: string
	input: string
	max_body_snapshot_size: number
	method: string
	output: string
	referer: string
	url_path: string
	user_agent: string

	constructor(input: string, host: string, output: string, ...options: HttpRoundTripOption[]) {
		this.accept = defaultAccept
		this.accept_language = defaultAcceptLanguage
		this.host = host
		this.input = input
		this.max_body_snapshot_size = defaultMaxBodySnapshotSize
		this.method = "GET"
		this.output = output
		this.referer = ""
		this.url_path = "/"
		this.user_agent = defaultUserAgent
		for (const option of options) {
			option(this)
		}
	}
}
