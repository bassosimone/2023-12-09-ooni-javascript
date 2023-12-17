/** An option for TcpConnectValue's constructor. */
export type TcpConnectOption = (_: TcpConnectValue) => void

/** Sets the tags. */
export function tcpConnectOptionTags(...tags: string[]): TcpConnectOption {
	return function (value: TcpConnectValue) {
		value.tags = tags
	}
}

/** Value of the tcp_connect node. */
export class TcpConnectValue {
	input: string
	output: string
	tags: string[] | null

	constructor(input: string, output: string, ...options: TcpConnectOption[]) {
		this.input = input
		this.output = output
		this.tags = null
		for (const option of options) {
			option(this)
		}
	}
}
