"use strict"

import { run as dslRun } from "../../dsl"

import { now as timeNow } from "../../../golang/time"

import { ArchivalObservations } from "../../model/archival"

import {
	WebObservation,
	WebObservationsContainter,
	sortByTypeAndFailure,
	filterByTargetTag
} from "../../micropipeline"

import { newDefaultRicherInput } from "./richerinput"

import { generateDsl } from "./generatedsl"

/** Returns the signal experiment name. */
export function experimentName() {
	return "signal"
}

/** Returns the signal experiment version. */
export function experimentVersion() {
	return "0.3.0"
}

// TODO(bassosimone): we should use richer input here
const tagTargetCdsi = "cdsi"

const tagTargetChat = "chat"

const tagTargetSfuVoip = "sfu_voip"

const tagTargetStorage = "storage"

function measure(): ArchivalObservations {
	// TODO(bassosimone): we will need to move richer input to toplevel
	const input = newDefaultRicherInput()

	// create the DSL
	const rootNode = generateDsl(input)

	// measure
	return dslRun(rootNode, timeNow())
}

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

function analyzeWithTag(testKeys: TestKeys, linear: WebObservation[], tag: string) {
	if (testKeys.signal_backend_failure !== null && testKeys.signal_backend_failure !== undefined) {
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
	testKeys.signal_backend_status = "blocked"
	testKeys.signal_backend_failure = first.failure
}

function analyze(testKeys: TestKeys) {
	// create the linear analysis to use as the starting point for determining
	// whether the signal backend has been blocked or not
	const container = new WebObservationsContainter()
	container.ingestArchivalObservations(testKeys)
	const linear = container.linearize()

	// analyze each signal-backend service that we measure
	analyzeWithTag(testKeys, linear, tagTargetCdsi)
	analyzeWithTag(testKeys, linear, tagTargetChat)
	analyzeWithTag(testKeys, linear, tagTargetSfuVoip)
	analyzeWithTag(testKeys, linear, tagTargetStorage)

	// emit analysis results
	console.log(`signal_backend_status: ${testKeys.signal_backend_status}`)
	console.log(`signal_backend_failure: ${testKeys.signal_backend_failure}`)
}

/** Runs the signal experiment and returns JSON serialized test keys. */
export function run() {
	// measure
	const testKeys = new TestKeys(measure())

	// analyze
	analyze(testKeys)

	// produce result
	return JSON.stringify(testKeys)
}
