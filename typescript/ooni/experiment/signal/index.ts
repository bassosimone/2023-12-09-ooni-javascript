"use strict"

import { run as dslRun } from "../../dsl"

import { now as timeNow } from "../../../golang/time"

import { WebObservationsContainter, } from "../../micropipeline"

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

function analyze(input: RicherInput, testKeys: TestKeys) {
	// create the linear analysis to use as the starting point for determining
	// whether the signal backend has been blocked or not
	const container = new WebObservationsContainter()
	container.ingestArchivalObservations(testKeys)
	const linear = container.linearize()

	// analyze each signal-backend service that we measure
	for (const entry of input.https_targets) {
		testKeys.updateForTag(linear, entry.targetTag)
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
