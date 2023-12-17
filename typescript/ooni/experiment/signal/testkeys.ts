import { WebObservation, filterByTargetTag, sortByTypeAndFailure } from "../../micropipeline"
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

	/** Updates the test keys by selecting the observations for the given tag. */
	updateForTag(linear: WebObservation[], tag: string) {
		if (this.signal_backend_failure !== null && this.signal_backend_failure !== undefined) {
			return
		}

		// only keep observations relevant for the current tag we're analyzing
		const filtered = filterByTargetTag(linear, tag)

		// sort such that HTTP and successes bubble up first
		sortByTypeAndFailure(filtered)

		// if there's nothing to analyze, do nothing (is this a bug?!)
		if (filtered.length <= 0) {
			return
		}

		// the first entry should be the most important operation of the measurement
		// tyically HTTP in the successful case and a success if possible
		const first = filtered[0]
		if (first.failure === undefined || first.failure === null) {
			return
		}

		// if there is a failure, it means we were not able to reach the HTTP and
		// success state for this tag, so let's mark the backend as blocked
		this.signal_backend_status = "blocked"
		this.signal_backend_failure = first.failure
	}
}
