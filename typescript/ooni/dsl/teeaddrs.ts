/** Callback invoked when creating tee_addrs. The argument is the input register. */
export type TeeAddrsCallback = (input: string) => void

/** Value of the tee_addrs node. */
export class TeeAddrsValue {
	input: string
	outputs: string[]

	constructor(input: string, output: string[]) {
		this.input = input
		this.outputs = output
	}
}
