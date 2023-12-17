/** Value of the take_n node. */
export class TakeNValue {
	/** The register from which to read input. */
	input: string

	/** The number of elements to take. */
	n: number

	/** The register where to write output. */
	output: string

	constructor(input: string, n: number, output: string) {
		this.input = input
		this.n = n
		this.output = output
	}
}
