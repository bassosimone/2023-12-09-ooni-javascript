"use strict"

function getTargetTag(entry) {
	let candidates = entry["tags"] || []
	for (const entry of candidates) {
		if (!entry.startsWith("target=")) {
			continue
		}
		return entry.replace(/^target=/, "")
	}
	return null
}

/** Returns a list of mini observations.
 *
 * We sort this list such that:
 *
 * - HTTP successes (if any) appear first;
 *
 * - HTTP failures (if any) follow;
 *
 * - TLS successes (if any) follow;
 *
 * - TLS failures (if any) follow;
 *
 * - TCP successes (if any) follow;
 *
 * - TCP failures (if any) follow;
 *
 * - DNS successes (if any) follow;
 *
 * - DNS failures (if any) follow.
 *
 * We ignore all the other possible successes and failures.
 */
exports.makeMiniObservations = function (testKeys) {
	let observations = []

	// 1. add successful HTTP observations first
	for (const entry of (testKeys["requests"] || [])) {
		if (entry.failure !== undefined && entry.failure === null) {
			observations.push({
				kind: "HTTP",
				failure: entry.failure,
				target: getTargetTag(entry),
			})
		}
	}

	// 2. add failed HTTP observations
	for (const entry of (testKeys["requests"] || [])) {
		if (entry.failure !== undefined && entry.failure !== null) {
			observations.push({
				kind: "HTTP",
				failure: entry.failure,
				target: getTargetTag(entry),
			})
		}
	}

	// 3. add successful TLS handshakes
	for (const entry of (testKeys["tls_handshakes"] || [])) {
		if (entry.failure !== undefined && entry.failure === null) {
			observations.push({
				kind: "TLS",
				failure: entry.failure,
				target: getTargetTag(entry),
			})
		}
	}

	// 4. add failed TLS handshakes
	for (const entry of (testKeys["tls_handshakes"] || [])) {
		if (entry.failure !== undefined && entry.failure !== null) {
			observations.push({
				kind: "TLS",
				failure: entry.failure,
				target: getTargetTag(entry),
			})
		}
	}

	// 5. add successful TCP connect
	for (const entry of (testKeys["network_events"] || [])) {
		if (entry.operation === "connect" && entry.failure !== undefined && entry.failure === null) {
			observations.push({
				kind: "TCP",
				failure: entry.failure,
				target: getTargetTag(entry),
			})
		}
	}

	// 6. add failed TCP connect
	for (const entry of (testKeys["network_events"] || [])) {
		if (entry.operation === "connect" && entry.failure !== undefined && entry.failure !== null) {
			observations.push({
				kind: "TCP",
				failure: entry.failure,
				target: getTargetTag(entry),
			})
		}
	}

	// 7. add successful DNS lookups
	for (const entry of (testKeys["queries"] || [])) {
		if (entry.failure !== undefined && entry.failure === null) {
			observations.push({
				kind: "DNS",
				failure: entry.failure,
				target: getTargetTag(entry),
			})
		}
	}

	// 8. add failed DNS lookups
	for (const entry of (testKeys["queries"] || [])) {
		if (entry.failure !== undefined && entry.failure !== null) {
			observations.push({
				kind: "DNS",
				failure: entry.failure,
				target: getTargetTag(entry),
			})
		}
	}

	return observations
}

/** Returns the first mini observation with the given target tag. */
exports.firstMiniObservationWithTargetTag = function (observations, tag) {
	for (const entry of observations) {
		if (entry.target === tag) {
			return entry
		}
	}
	return null
}
