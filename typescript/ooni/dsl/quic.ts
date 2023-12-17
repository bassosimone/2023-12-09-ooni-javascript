/** An option for QuicHandshakeValue's constructor. */
export type QuicHandshakeOption = (_: QuicHandshakeValue) => void

/** Sets insecure_skip_verify. */
export function quicHandshakeOptionInsecureSkipVerify(skip: boolean): QuicHandshakeOption {
	return function (value: QuicHandshakeValue) {
		value.insecure_skip_verify = skip
	}
}

/** Sets root_cas */
export function quicHandshakeOptionRootCAs(...cas: string[]): QuicHandshakeOption {
	return function (value: QuicHandshakeValue) {
		value.root_cas = cas
	}
}

/** Sets the tags. */
export function quicConnectOptionTags(...tags: string[]): QuicHandshakeOption {
	return function (value: QuicHandshakeValue) {
		value.tags = tags
	}
}

/** Value of the quic_handshake node. */
export class QuicHandshakeValue {
	input: string
	insecure_skip_verify: boolean
	next_protos: string[]
	output: string
	root_cas: string[] | null
	server_name: string
	tags: string[] | null

	constructor(input: string, nextProtos: string[], output: string,
		serverName: string, ...options: QuicHandshakeOption[]) {
		this.input = input
		this.insecure_skip_verify = false
		this.next_protos = nextProtos
		this.output = output
		this.root_cas = null
		this.server_name = serverName
		this.tags = null
		for (const option of options) {
			option(this)
		}
	}
}
