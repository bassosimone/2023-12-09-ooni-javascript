/** Value of the dedup_addrs node. */
export class DedupAddrsValue {
	/** List of input registers to read from. */
	inputs: string[]

	/** Output register to write to. */
	output: string

	constructor(inputs: string[], output: string) {
		this.inputs = inputs
		this.output = output
	}
}
