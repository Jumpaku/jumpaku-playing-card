import {DescField, DescMessage, JsonObject, ScalarType} from "@bufbuild/protobuf";
import type {MessageShape} from "@bufbuild/protobuf/dist/cjs/types";
import {mergeFromJson} from "@bufbuild/protobuf";

export function overwriteConfigWithJson<Desc extends DescMessage>(schema: Desc, config: MessageShape<Desc>, overwrite: JsonObject) {
    return mergeFromJson(schema, config, overwrite);
}


export function overwriteConfigWithEnv<Desc extends DescMessage>(schema: Desc, config: MessageShape<Desc>, env: NodeJS.ProcessEnv) {
    const envValues = Object.fromEntries(
        Object.entries(env)
            .map(([k, v]) => [k.toLowerCase(), v]));
    const overwrite = {};
    walkField(schema, (fieldPath, field) => {
        const envLowerName = fieldPath.join("_").toLowerCase();
        if (!(envLowerName in envValues)) {
            return;
        }
        const envValue = envValues[envLowerName];
        if (envValue == null) {
            return;
        }
        if (field.fieldKind === "enum") {
            const v = field.enum.values
                .find(v => v.name === envValue || v.number.toString() === envValue);
            if (v === undefined) {
                throw new Error(`Invalid enum value: ${envValue}`);
            }
            setObjectValue(overwrite, fieldPath, v);
        }
        if (field.fieldKind === "scalar") {
            if (field.scalar === ScalarType.BOOL) {
                if (!["true", "false", "1", "0", "t", "f"].includes(envValue.toLowerCase())) {
                    throw new Error(`Invalid boolean value: ${envValue}`);
                }
                setObjectValue(overwrite, fieldPath, ["true", "1", "t"].includes(envValue.toLowerCase()));
            } else {
                setObjectValue(overwrite, fieldPath, envValue);
            }
        }
        if (field.fieldKind === "message") {
            if (field.message.typeName === "google.protobuf.BoolValue") {
                setObjectValue(overwrite, fieldPath, ["true", "false", "1", "0", "t", "f"].includes(envValue.toLowerCase()));
            } else {
                switch (field.message.typeName) {
                    case "google.protobuf.StringValue":
                    case "google.protobuf.Timestamp":
                    case "google.protobuf.BytesValue":
                    case "google.protobuf.Int32Value":
                    case "google.protobuf.Int64Value":
                    case "google.protobuf.UInt32Value":
                    case "google.protobuf.UInt64Value":
                    case "google.protobuf.Duration":
                    case "google.protobuf.DoubleValue":
                        setObjectValue(overwrite, fieldPath, envValue);
                        break;
                }
            }
        }
    });
    return mergeFromJson(schema, config, overwrite);
}

function walkField(schema: DescMessage, f: (fieldPath: string[], s: DescField) => void, fieldPath: string[] = []) {
    for (const field of schema.fields) {
        if (field.fieldKind === "map" || field.fieldKind === "list") {
            throw new Error("Unsupported field kind: " + field.fieldKind);
        }
        f([...fieldPath, field.name], field);
        if (field.fieldKind === "message") {
            walkField(field.message, f, [...fieldPath, field.name]);
        }
    }
}

function setObjectValue(obj: any, fieldPath: string[], value: any) {
    for (const field of fieldPath.slice(0, -1)) {
        if (!(field in obj)) {
            obj[field] = {};
        }
        obj = obj[field];
    }
    obj[fieldPath[fieldPath.length - 1]] = value;
}

