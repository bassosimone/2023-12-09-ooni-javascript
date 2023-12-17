import { ArchivalObservations } from "../../model/archival"

/** TestKeys contains the signal experiment test keys */
export class TestKeys extends ArchivalObservations {
	signal_backend_status: string = "ok"
	signal_backend_failure: string | null = null

	constructor(obs: ArchivalObservations) {
		// make sure we create the superclass first
		super()

		// then copy from superclass instance
		this.network_events = obs.network_events
		this.queries = obs.queries
		this.requests = obs.requests
		this.tcp_connect = obs.tcp_connect
		this.tls_handshakes = obs.tls_handshakes
		this.quic_handshakes = obs.quic_handshakes
	}
}
