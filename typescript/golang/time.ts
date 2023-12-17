// @ts-ignore
import { timeNow as __golangTimeNow } from "_golang"

/** Golang time representation. */
export class Time {
	v: any

	constructor(v: any) {
		this.v = v
	}
}

export function now(): Time {
    return new Time(__golangTimeNow())
}
