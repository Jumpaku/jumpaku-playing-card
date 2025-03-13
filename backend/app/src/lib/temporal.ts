import {Temporal} from "@js-temporal/polyfill";

export function instant(timestamp: Date): Temporal.Instant {
    return Temporal.Instant.fromEpochMilliseconds(timestamp.getTime());
}

export function duration(seconds: number|bigint): Temporal.Duration {
    return Temporal.Duration.from({seconds: Number(seconds)});
}

export function date(instant: Temporal.Instant): Date {
    return new Date(instant.epochMilliseconds);
}

export function seconds(duration: Temporal.Duration): number {
    return duration.total("seconds");
}
