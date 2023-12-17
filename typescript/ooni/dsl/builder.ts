import { DedupAddrsValue } from "./dedupaddrs"

import { DnsLookupUdpOption, DnsLookupUdpValue } from "./dnslookupudp"

import { DropValue } from "./drop"

import { GetaddrinfoOption, GetaddrinfoValue } from "./getaddrinfo"

import { HttpRoundTripOption, HttpRoundTripValue } from "./http"

import { MakeEndpointsValue } from "./makeendpoints"

import { QuicHandshakeOption, QuicHandshakeValue } from "./quic"

import { TakeNValue } from "./taken"

import { TcpConnectOption, TcpConnectValue } from "./tcp"

import { TeeAddrsCallback, TeeAddrsValue } from "./teeaddrs"

import { TlsHandshakeOption, TlsHandshakeValue } from "./tls"

/** A node inside the DSL. */
export class StageNode {
	/** The name of the DSL node. */
	name: string

	/** The value of the DSL node. */
	value: any

	constructor(name: string, value: any) {
		this.name = name
		this.value = value
	}
}

/** The root node of the DSL. */
export class RootNode {
	/** The stages composing the DSL. */
	stages: StageNode[]

	constructor(stages: StageNode[]) {
		this.stages = stages
	}
}

/** Builds the DSL. */
export class Builder {
	private stages: StageNode[] = []
	private nextRegisterId: number = 0

	private push(name: string, value: any) {
		this.stages.push(new StageNode(name, value))
	}

	private newRegister(): string {
		const value = this.nextRegisterId
		this.nextRegisterId += 1
		return `$${value}`
	}

	/** Builds and returns the root node of the DSL. */
	buildRootNode(): RootNode {
		return new RootNode(this.stages)
	}

	/** Adds a dedup_addrs node to the DSL and returns the output register. */
	dedupAddrs(...inputs: string[]): string {
		const output = this.newRegister()
		const value = new DedupAddrsValue(inputs, output)
		this.push("dedup_addrs", value)
		return output
	}

	/** Adds a dns_lookup_udp node to the DSL and returns the output register. */
	dnsLookupUdp(domain: string, resolver: string, ...options: DnsLookupUdpOption[]): string {
		const output = this.newRegister()
		const value = new DnsLookupUdpValue(domain, output, resolver, ...options)
		this.push("dns_lookup_udp", value)
		return output
	}

	/** Adds a drop node to the DSL. */
	drop(input: string): void {
		const output = this.newRegister()
		const value = new DropValue(input, output)
		this.push("drop", value)
	}

	/** Adds a getaddrinfo node to the DSL and returns the output register. */
	getaddrinfo(domain: string, ...options: GetaddrinfoOption[]): string {
		const output = this.newRegister()
		const value = new GetaddrinfoValue(domain, output, ...options)
		this.push("getaddrinfo", value)
		return output
	}

	/** Adds an http_round_trip node to the DSL. */
	httpRoundTrip(host: string, input: string, ...options: HttpRoundTripOption[]): void {
		const output = this.newRegister()
		const value = new HttpRoundTripValue(input, host, output, ...options)
		this.push("http_round_trip", value)
	}

	/** Adds a make_endpoints node to the DSL and returns the output register. */
	makeEndpoints(port: string, input: string): string {
		const output = this.newRegister()
		const value = new MakeEndpointsValue(input, output, port)
		this.push("make_endpoints", value)
		return output
	}

	/** Adds a quic_handshake node to the DSL and returns the output register. */
	quicHandshake(serverName: string, nextProtos: string[], input: string, ...options: QuicHandshakeOption[]): string {
		const output = this.newRegister()
		const value = new QuicHandshakeValue(input, nextProtos, output, serverName, ...options)
		this.push("quic_handshake", value)
		return output
	}

	/** Adds a take_n node to the DSL and returns the output register. */
	takeN(count: number, input: string): string {
		const output = this.newRegister()
		const value = new TakeNValue(input, count, output)
		this.push("take_n", value)
		return output
	}

	/** Adds a tcp_connect node to the DSL and returns the output register. */
	tcpConnect(input: string, ...options: TcpConnectOption[]): string {
		const output = this.newRegister()
		const value = new TcpConnectValue(input, output, ...options)
		this.push("tcp_connect", value)
		return output
	}

	/** Adds a tee_addrs node to the DSL. */
	teeAddrs(input: string, ...callbacks: TeeAddrsCallback[]): void {
		// Implementation note: we MUST emit tee_addrs before the subsequent stages
		// otherwise miniooni 3.20.0 complains that a register is missing.
		let outputs: string[] = []
		const value = new TeeAddrsValue(input, outputs)
		this.push("tee_addrs", value)

		// Now that we have emitted tee_addrs we can proceed with generating the
		// subsequent stages which will reference the outputs of tee_addrs.
		for (const callback of callbacks) {
			const output = this.newRegister()
			callback(output)
			outputs.push(output)
		}
	}

	/** Adds a tls_handshake node to the DSL and returns the output register. */
	tlsHandshake(serverName: string, nextProtos: string[], input: string, ...options: TlsHandshakeOption[]): string {
		const output = this.newRegister()
		const value = new TlsHandshakeValue(input, nextProtos, output, serverName, ...options)
		this.push("tls_handshake", value)
		return output
	}
}
