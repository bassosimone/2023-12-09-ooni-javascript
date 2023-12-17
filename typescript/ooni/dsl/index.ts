export { Builder } from "./builder";

export { getaddrinfoOptionTags } from "./getaddrinfo";

export { tcpConnectOptionTags } from "./tcp";

export { tlsHandshakeOptionRootCAs } from "./tls";

// @ts-ignore
import { runDSL as __ooniRunDsl } from "_ooni"

import { RootNode } from "./builder";

/** Runs a DSL with the given DSL @p rootNode and @p zeroTime. */
export function run(rootNode: RootNode, zeroTime: any) {
    const tk = __ooniRunDsl(rootNode, zeroTime)
    return JSON.parse(tk)
}
