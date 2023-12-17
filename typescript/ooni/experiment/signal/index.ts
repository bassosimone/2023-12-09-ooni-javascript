"use strict"

import {
	Builder as DSLBuilder,
	run as dslRun,
	getaddrinfoOptionTags,
	tcpConnectOptionTags,
	tlsHandshakeOptionRootCAs
} from "../../dsl"

import { now as timeNow } from "../../../golang/time"

import { ArchivalObservations } from "../../model/archival"

import {
	WebObservation,
	WebObservationsContainter,
	sortByTypeAndFailure,
	filterByTargetTag
} from "../../micropipeline"

/** Returns the signal experiment name. */
export function experimentName() {
	return "signal"
}

/** Returns the signal experiment version. */
export function experimentVersion() {
	return "0.3.0"
}

const signalCA = `-----BEGIN CERTIFICATE-----
MIID7zCCAtegAwIBAgIJAIm6LatK5PNiMA0GCSqGSIb3DQEBBQUAMIGNMQswCQYD
VQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5j
aXNjbzEdMBsGA1UECgwUT3BlbiBXaGlzcGVyIFN5c3RlbXMxHTAbBgNVBAsMFE9w
ZW4gV2hpc3BlciBTeXN0ZW1zMRMwEQYDVQQDDApUZXh0U2VjdXJlMB4XDTEzMDMy
NTIyMTgzNVoXDTIzMDMyMzIyMTgzNVowgY0xCzAJBgNVBAYTAlVTMRMwEQYDVQQI
DApDYWxpZm9ybmlhMRYwFAYDVQQHDA1TYW4gRnJhbmNpc2NvMR0wGwYDVQQKDBRP
cGVuIFdoaXNwZXIgU3lzdGVtczEdMBsGA1UECwwUT3BlbiBXaGlzcGVyIFN5c3Rl
bXMxEzARBgNVBAMMClRleHRTZWN1cmUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAw
ggEKAoIBAQDBSWBpOCBDF0i4q2d4jAXkSXUGpbeWugVPQCjaL6qD9QDOxeW1afvf
Po863i6Crq1KDxHpB36EwzVcjwLkFTIMeo7t9s1FQolAt3mErV2U0vie6Ves+yj6
grSfxwIDAcdsKmI0a1SQCZlr3Q1tcHAkAKFRxYNawADyps5B+Zmqcgf653TXS5/0
IPPQLocLn8GWLwOYNnYfBvILKDMItmZTtEbucdigxEA9mfIvvHADEbteLtVgwBm9
R5vVvtwrD6CCxI3pgH7EH7kMP0Od93wLisvn1yhHY7FuYlrkYqdkMvWUrKoASVw4
jb69vaeJCUdU+HCoXOSP1PQcL6WenNCHAgMBAAGjUDBOMB0GA1UdDgQWBBQBixjx
P/s5GURuhYa+lGUypzI8kDAfBgNVHSMEGDAWgBQBixjxP/s5GURuhYa+lGUypzI8
kDAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBBQUAA4IBAQB+Hr4hC56m0LvJAu1R
K6NuPDbTMEN7/jMojFHxH4P3XPFfupjR+bkDq0pPOU6JjIxnrD1XD/EVmTTaTVY5
iOheyv7UzJOefb2pLOc9qsuvI4fnaESh9bhzln+LXxtCrRPGhkxA1IMIo3J/s2WF
/KVYZyciu6b4ubJ91XPAuBNZwImug7/srWvbpk0hq6A6z140WTVSKtJG7EP41kJe
/oF4usY5J7LPkxK3LWzMJnb5EIJDmRvyH8pyRwWg6Qm6qiGFaI4nL8QU4La1x2en
4DGXRaLMPRwjELNgQPodR38zoCMuA8gHZfZYYoZ7D7Q1wNUiVHcxuFrEeBaYJbLE
rwLV
-----END CERTIFICATE-----`

const signalCANew = `
-----BEGIN CERTIFICATE-----
MIIF2zCCA8OgAwIBAgIUAMHz4g60cIDBpPr1gyZ/JDaaPpcwDQYJKoZIhvcNAQEL
BQAwdTELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcT
DU1vdW50YWluIFZpZXcxHjAcBgNVBAoTFVNpZ25hbCBNZXNzZW5nZXIsIExMQzEZ
MBcGA1UEAxMQU2lnbmFsIE1lc3NlbmdlcjAeFw0yMjAxMjYwMDQ1NTFaFw0zMjAx
MjQwMDQ1NTBaMHUxCzAJBgNVBAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRYw
FAYDVQQHEw1Nb3VudGFpbiBWaWV3MR4wHAYDVQQKExVTaWduYWwgTWVzc2VuZ2Vy
LCBMTEMxGTAXBgNVBAMTEFNpZ25hbCBNZXNzZW5nZXIwggIiMA0GCSqGSIb3DQEB
AQUAA4ICDwAwggIKAoICAQDEecifxMHHlDhxbERVdErOhGsLO08PUdNkATjZ1kT5
1uPf5JPiRbus9F4J/GgBQ4ANSAjIDZuFY0WOvG/i0qvxthpW70ocp8IjkiWTNiA8
1zQNQdCiWbGDU4B1sLi2o4JgJMweSkQFiyDynqWgHpw+KmvytCzRWnvrrptIfE4G
PxNOsAtXFbVH++8JO42IaKRVlbfpe/lUHbjiYmIpQroZPGPY4Oql8KM3o39ObPnT
o1WoM4moyOOZpU3lV1awftvWBx1sbTBL02sQWfHRxgNVF+Pj0fdDMMFdFJobArrL
VfK2Ua+dYN4pV5XIxzVarSRW73CXqQ+2qloPW/ynpa3gRtYeGWV4jl7eD0PmeHpK
OY78idP4H1jfAv0TAVeKpuB5ZFZ2szcySxrQa8d7FIf0kNJe9gIRjbQ+XrvnN+ZZ
vj6d+8uBJq8LfQaFhlVfI0/aIdggScapR7w8oLpvdflUWqcTLeXVNLVrg15cEDwd
lV8PVscT/KT0bfNzKI80qBq8LyRmauAqP0CDjayYGb2UAabnhefgmRY6aBE5mXxd
byAEzzCS3vDxjeTD8v8nbDq+SD6lJi0i7jgwEfNDhe9XK50baK15Udc8Cr/ZlhGM
jNmWqBd0jIpaZm1rzWA0k4VwXtDwpBXSz8oBFshiXs3FD6jHY2IhOR3ppbyd4qRU
pwIDAQABo2MwYTAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0TAQH/BAUwAwEB/zAdBgNV
HQ4EFgQUtfNLxuXWS9DlgGuMUMNnW7yx83EwHwYDVR0jBBgwFoAUtfNLxuXWS9Dl
gGuMUMNnW7yx83EwDQYJKoZIhvcNAQELBQADggIBABUeiryS0qjykBN75aoHO9bV
PrrX+DSJIB9V2YzkFVyh/io65QJMG8naWVGOSpVRwUwhZVKh3JVp/miPgzTGAo7z
hrDIoXc+ih7orAMb19qol/2Ha8OZLa75LojJNRbZoCR5C+gM8C+spMLjFf9k3JVx
dajhtRUcR0zYhwsBS7qZ5Me0d6gRXD0ZiSbadMMxSw6KfKk3ePmPb9gX+MRTS63c
8mLzVYB/3fe/bkpq4RUwzUHvoZf+SUD7NzSQRQQMfvAHlxk11TVNxScYPtxXDyiy
3Cssl9gWrrWqQ/omuHipoH62J7h8KAYbr6oEIq+Czuenc3eCIBGBBfvCpuFOgckA
XXE4MlBasEU0MO66GrTCgMt9bAmSw3TrRP12+ZUFxYNtqWluRU8JWQ4FCCPcz9pg
MRBOgn4lTxDZG+I47OKNuSRjFEP94cdgxd3H/5BK7WHUz1tAGQ4BgepSXgmjzifF
T5FVTDTl3ZnWUVBXiHYtbOBgLiSIkbqGMCLtrBtFIeQ7RRTb3L+IE9R0UB0cJB3A
Xbf1lVkOcmrdu2h8A32aCwtr5S1fBF1unlG7imPmqJfpOMWa8yIF/KWVm29JAPq8
Lrsybb0z5gg8w7ZblEuB9zOW9M3l60DXuJO6l7g+deV6P96rv2unHS8UlvWiVWDy
9qfgAJizyy3kqM4lOwBH
-----END CERTIFICATE-----`

function generateDslForHTTPS(builder: DSLBuilder, domain: string, tag: string) {
	// properly transform the tag into a key=value format
	tag = `target=${tag}`

	// obtain IP addrs from the domain name
	const addrs = builder.getaddrinfo(domain, getaddrinfoOptionTags(tag))

	// map addrs to endpoints
	const endpoints = builder.makeEndpoints("443", addrs)

	// establish TCP connections
	const tcpConnections = builder.tcpConnect(endpoints, tcpConnectOptionTags(tag))

	// perform TLS handshakes with the custom root CAs
	const tlsConnections = builder.tlsHandshake(
		domain,
		["h2", "http/1.1"],
		tcpConnections,
		tlsHandshakeOptionRootCAs(signalCA, signalCANew),
	)

	// make sure we use juse a single connection for the HTTP round trip
	const firstConn = builder.takeN(1, tlsConnections)

	// perform HTTP round trips
	builder.httpRoundTrip(domain, firstConn)
}

function generateDSLForUptime(builder: DSLBuilder) {
	// obtain IP adds from the domain name
	const addrs = builder.getaddrinfo("uptime.signal.org")

	// drop the results since we don't need to do anything with them
	builder.drop(addrs)
}

const tagTargetCdsi = "cdsi"

const tagTargetChat = "chat"

const tagTargetSfuVoip = "sfu_voip"

const tagTargetStorage = "storage"

function measure(): ArchivalObservations {
	// create the builder
	const builder = new DSLBuilder()

	// build DSL for HTTPS
	generateDslForHTTPS(builder, "cdsi.signal.org", tagTargetCdsi)
	generateDslForHTTPS(builder, "chat.signal.org", tagTargetChat)
	generateDslForHTTPS(builder, "sfu.voip.signal.org", tagTargetSfuVoip)
	generateDslForHTTPS(builder, "storage.signal.org", tagTargetStorage)

	// build DSL for uptime.signal.org
	generateDSLForUptime(builder)

	// measure
	const rootNode = builder.buildRootNode()
	const testKeys = dslRun(rootNode, timeNow())

	return testKeys
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
