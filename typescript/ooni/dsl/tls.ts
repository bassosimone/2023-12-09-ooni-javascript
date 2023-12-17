/** An option for TlsHandshakeValue's constructor. */
export type TlsHandshakeOption = (_: TlsHandshakeValue) => void

/** Sets insecure_skip_verify. */
export function tlsHandshakeOptionInsecureSkipVerify(skip: boolean): TlsHandshakeOption {
	return function (value: TlsHandshakeValue) {
		value.insecure_skip_verify = skip
	}
}

/** Sets root_cas */
export function tlsHandshakeOptionRootCAs(...cas: string[]): TlsHandshakeOption {
	return function (value: TlsHandshakeValue) {
		value.root_cas = cas
	}
}

/** Value of the tls_handshake node. */
export class TlsHandshakeValue {
	input: string
	insecure_skip_verify: boolean
	next_protos: string[]
	output: string
	root_cas: string[] | null
	server_name: string

	constructor(input: string, nextProtos: string[], output: string,
		serverName: string, ...options: TlsHandshakeOption[]) {
		this.input = input
		this.insecure_skip_verify = false
		this.next_protos = nextProtos
		this.output = output
		this.root_cas = null
		this.server_name = serverName
		for (const option of options) {
			option(this)
		}
	}
}
