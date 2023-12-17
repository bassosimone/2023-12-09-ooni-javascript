/** Value of the make_endpoints node. */
export class MakeEndpointsValue {
	/** The register from which to read input. */
	input: string

	/** The register where to write output. */
	output: string

	/** The port to use for making the endpoints. */
	port: string

	constructor(input: string, output: string, port: string) {
		this.input = input
		this.output = output
		this.port = port
	}
}
