/** Value of the drop node. */
export class DropValue {
	/** The register to read the input from. */
	input: string

	/** The register to write the output to. */
	output: string

	constructor(input: string, output: string) {
		this.input = input
		this.output = output
	}
}
