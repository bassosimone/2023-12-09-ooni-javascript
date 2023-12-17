"use strict"

import { run as dslRun } from "../../dsl"

import { now as timeNow } from "../../../golang/time"

import {
	WebObservation,
	WebObservationsContainter,
	sortByTypeAndFailure,
	filterByTargetTag
} from "../../micropipeline"

import { RicherInput, newDefaultRicherInput } from "./richerinput"

import { generateDsl } from "./generatedsl"

import { TestKeys } from "./testkeys"

/** Returns the signal experiment name. */
export function experimentName() {
	return "signal"
}

/** Returns the signal experiment version. */
export function experimentVersion() {
	return "0.3.0"
}

function measure(input: RicherInput): TestKeys {
	// create the DSL
	const rootNode = generateDsl(input)

	// measure
	return new TestKeys(dslRun(rootNode, timeNow()))
}

/* TODO(bassosimone): this function should be a method of TestKeys. */
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

function analyze(input: RicherInput, testKeys: TestKeys) {
	// create the linear analysis to use as the starting point for determining
	// whether the signal backend has been blocked or not
	const container = new WebObservationsContainter()
	container.ingestArchivalObservations(testKeys)
	const linear = container.linearize()

	// analyze each signal-backend service that we measure
	for (const entry of input.https_targets) {
		analyzeWithTag(testKeys, linear, entry.targetTag)
	}

	// emit analysis results
	console.log(`signal_backend_status: ${testKeys.signal_backend_status}`)
	console.log(`signal_backend_failure: ${testKeys.signal_backend_failure}`)
}

/** Runs the signal experiment and returns JSON serialized test keys. */
export function run() {
	// create default richer input
	const input = newDefaultRicherInput()

	// measure
	const testKeys = measure(input)

	// analyze
	analyze(input, testKeys)

	// produce result
	return JSON.stringify(testKeys)
}
