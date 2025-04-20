import {panic} from "./panic";

export function mustGetEnv(key: string): string {
    const value = process.env[key];
    if (value == null) {
        panic(`missing env var: ${key}`);
    }
    return value;
}