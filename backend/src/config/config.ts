import {panic} from "@/lib/panic";

export type Config = {
    postgres_connection_string: string
};

let config: Config;

export function loadConfig() {
    config = {
        postgres_connection_string: process.env["POSTGRES_CONNECTION_STRING"] ?? panic("env POSTGRES_CONNECTION_STRING required"),
    };
}

export function getConfig(): Readonly<Config> {
    return config;
}