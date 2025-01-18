import {DescMethod, getExtension, hasExtension} from "@bufbuild/protobuf";
import {http} from "./gen/pb/google/api/annotations_pb.js";
import {HttpRule} from "./gen/pb/google/api/http_pb.js";

export function findHttpRule(method: DescMethod): HttpRuleExt | null {
    const options = method.proto.options;
    if (options == null || !hasExtension(options, http)) {
        return null;
    }
    const httpRule = getExtension(options, http);
    return new HttpRuleExt(httpRule);
}

export class HttpRuleExt {
    constructor(private rule: HttpRule) {
    }

    method(): string {
        const pattern = this.rule.pattern;
        if (!pattern) return "";

        switch (pattern.case) {
            case "get":
                return "GET";
            case "post":
                return "POST";
            case "put":
                return "PUT";
            case "patch":
                return "PATCH";
            case "delete":
                return "DELETE";
            case "custom":
                return pattern.value.kind;
            default:
                return "";
        }
    }

    pathTemplate(): HttpRulePathTemplate {
        const pattern = this.rule.pattern;
        let pathPattern: string;
        switch (pattern.case) {
            case "get":
            case "post":
            case "put":
            case "patch":
            case "delete":
                pathPattern = pattern.value;
                break;
            case "custom":
                pathPattern = pattern.value.path;
                break;
            default:
                throw new Error("unexpected pattern case " + pattern.case);
        }
        return new HttpRulePathTemplate(parsePathTemplateSegments(pathPattern));
    }
}

export class HttpRulePathTemplate {

    constructor(public segments: HttpRulePathTemplateSegment[]) {
    }
}

export class HttpRulePathTemplateSegment {
    constructor(public value: string, public variable?: HttpRulePathTemplateVariable) {
    }
}

export class HttpRulePathTemplateVariable {
    constructor(public fieldPath: string[], public segments: HttpRulePathTemplateSegment[]) {
    }
}

const regexSingleAsterisk = /^\*/;
const regexDoubleAsterisk = /^\*\*/;
const regexLiteral = /^(\*|\*\*|[^{/]+)/;
const regexVariable = /^\{[^}]+}/;

function cutString(s: string, sep: string): [string, string, boolean] {
    const i = s.indexOf(sep);
    if (i >= 0) {
        return [s.substring(0, i), s.substring(i + sep.length), true];
    }
    return [s, "", false];
}

function parsePathTemplateSegments(pathPattern: string): HttpRulePathTemplateSegment[] {
    const segments: HttpRulePathTemplateSegment[] = [];

    while (pathPattern !== "") {
        pathPattern = pathPattern.replace(/^\//, ""); // skip leading slash

        let match;
        if ((match = regexDoubleAsterisk.exec(pathPattern))) {
            segments.push(new HttpRulePathTemplateSegment(match[0]));
            pathPattern = pathPattern.replace(match[0], "");
            continue;
        }
        if ((match = regexSingleAsterisk.exec(pathPattern))) {
            segments.push(new HttpRulePathTemplateSegment(match[0]));
            pathPattern = pathPattern.replace(match[0], "");
            continue;
        }
        if ((match = regexLiteral.exec(pathPattern))) {
            segments.push(new HttpRulePathTemplateSegment(match[0]));
            pathPattern = pathPattern.replace(match[0], "");
            continue;
        }
        if ((match = regexVariable.exec(pathPattern))) {
            const [l, r, cut] = cutString(match[0].slice(1, -1), "=");
            segments.push(new HttpRulePathTemplateSegment(match[0], new HttpRulePathTemplateVariable(
                l.split("."),
                parsePathTemplateSegments(cut ? r : "*")
            )));
            pathPattern = pathPattern.replace(match[0], "");
            continue;
        }

        throw new Error("invalid path template syntax: " + pathPattern);
    }
    return segments;
}

