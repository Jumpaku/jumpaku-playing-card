import {Request} from "express";

export function extractJWT(req: Request): string | null {
    const a = req.headers.authorization;
    if (a == null) {
        return null;
    }
    if (!a.startsWith("Bearer") && !a.startsWith("bearer")) {
        return null;
    }

    return a.slice('Bearer'.length).trim();
}
