"use strict"

const _ooni = require("_ooni")

/** Runs a DSL with the given DSL @p rootNode and @p zeroTime. */
exports.run = function (rootNode, zeroTime) {
    const rawObservations = _ooni.runDSL(rootNode, zeroTime)
    return JSON.parse(rawObservations)
}

/** Sets tags for a given getaddrinfo node. */
exports.getaddrinfoOptionTags = function (...tags) {
    return function (stage) {
        stage.value.tags.push(...tags)
    }
}

/** Sets tags for a given tcp_connect node. */
exports.tcpConnectOptionTags = function (...tags) {
    return function (stage) {
        stage.value.tags.push(...tags)
    }
}

/** Sets the root CAs to be used by TLS. */
exports.tlsHandshakeOptionRootCAs = function (...certs) {
    return function (stage) {
        stage.value.root_cas.push(...certs)
    }
}

const defaultAccept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"

const defaultAcceptLanguage = "en-US,en;q=0.9"

const defaultMaxBodySnapshotSize = 1<<19

const defaultUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"

/** Builds the DSL. */
exports.Builder = class {
    #stages = []
    #nextRegisterId = 0

    #newRegister() {
        const value = this.#nextRegisterId
        this.#nextRegisterId += 1
        return `$${value}`
    }

    #applyOptionsAddStageAndReturnOutput(stage, ...options) {
        // apply options
        for (const option of options) {
            option(stage)
        }

        // append to the list of stages
        this.#stages.push(stage)

        // return the output register
        return stage.value.output
    }

    /** Builds and returns the DSL root node. */
    buildRootNode() {
        return {
            "stages": this.#stages,
        }
    }

    /** Adds a drop type node to the DSL and returns the output register.
     *
     * Deprecated: use drop instead.
     */
    close(input) {
        console.log("close is deprecated: use drop instead")
        return this.drop(input)
    }

    /**
     * Adds a drop type node to the DSL and returns the output register.
     *
     * Deprecated: use drop instead.
     */
    discard(input) {
        console.log("discard is deprecated: use drop instead")
        return this.drop(input)
    }

    /** Adds a drop type node to the DSL and returns the output register. */
    drop(input) {
        return this.#applyOptionsAddStageAndReturnOutput({
            name: "drop",
            value: {
                input: input,
                output: this.#newRegister(),
            }
        })
    }

    /** Adds a dns_lookup_udp type node to the DSL and returns the output register. */
    dnsLookupUdp(domain, resolver, ...options) {
        return this.#applyOptionsAddStageAndReturnOutput({
            name: "dns_lookup_udp",
            value: {
                domain: domain,
                output: this.#newRegister(),
                resolver: resolver,
                tags: [],
            }
        }, ...options)
    }

    /** Adds a getaddrinfo type node to the DSL and returns the output register. */
    getaddrinfo(domain, ...options) {
        return this.#applyOptionsAddStageAndReturnOutput({
            name: "getaddrinfo",
            value: {
                domain: domain,
                output: this.#newRegister(),
                tags: []
            }
        }, ...options)
    }

    /** Adds a dedup_addrs type node to the DSL and returns the output register. */
    dedupAddrs(...inputs) {
        return this.#applyOptionsAddStageAndReturnOutput({
            name: "dedup_addrs",
            value: {
                inputs: [...inputs],
                output: this.#newRegister(),
            }
        })
    }

    /** Adds a tee_addrs type node to the DSL. */
    teeAddrs(input, ...callbacks) {
        // create the stage
        const stage = {
            name: "tee_addrs",
            value: {
                input: input,
                outputs: [],
            }
        }

        // append to the list of stages
        this.#stages.push(stage)

        for (const callback of callbacks) {
            // invoke the callback with its input register, which
            // is one of the outputs of teeAddrs
            const output = this.#newRegister()
            callback(output)

            // remember the output
            stage.value.outputs.push(output)
        }
    }

    /** Adds a make_endpoints type node to the DSL and returns the output register. */
    makeEndpoints(port, input) {
        return this.#applyOptionsAddStageAndReturnOutput({
            name: "make_endpoints",
            value: {
                input: input,
                output: this.#newRegister(),
                port: port,
            }
        })
    }

    /** Adds a tcp_connect type node to the DSL and returns the output register. */
    tcpConnect(input, ...options) {
        return this.#applyOptionsAddStageAndReturnOutput({
            name: "tcp_connect",
            value: {
                input: input,
                output: this.#newRegister(),
                tags: [],
            }
        }, ...options)
    }

    /** Adds a tls_handshake type node to the DSL and returns the output register. */
    tlsHandshake(serverName, nextProtos, input, ...options) {
        return this.#applyOptionsAddStageAndReturnOutput({
            name: "tls_handshake",
            value: {
                input: input,
                insecure_skip_verify: false,
                next_protos: [...nextProtos],
                output: this.#newRegister(),
                root_cas: [],
                server_name: serverName,
            }
        }, ...options)
    }

    /** Adds a quic_handshake type node to the DSL and returns the output register. */
    quicHandshake(serverName, nextProtos, input) {
        return this.#applyOptionsAddStageAndReturnOutput({
            name: "quic_handshake",
            value: {
                input: input,
                next_protos: [...nextProtos],
                output: this.#newRegister(),
                server_name: serverName,
            }
        })
    }

    /** Adds an http_round_trip type node to the DSL and returns the output register. */
    httpRoundTrip(host, input, ...options) {
        return this.#applyOptionsAddStageAndReturnOutput({
            name: "http_round_trip",
            value: {
                accept: defaultAccept,
                accept_language: defaultAcceptLanguage,
                host: host,
                input: input,
                max_body_snapshot_size: defaultMaxBodySnapshotSize,
                method: "GET",
                output: this.#newRegister(),
                referer: "",
                url_path: "/",
                user_agent: defaultUserAgent,
            }
        }, ...options)
    }

    /** Adds a take_n type node to the DSL and returns the output register. */
    takeN(count, input) {
        return this.#applyOptionsAddStageAndReturnOutput({
            name: "take_n",
            value: {
                input: input,
                n: count,
                output: this.#newRegister(),
            }
        })
    }
}
