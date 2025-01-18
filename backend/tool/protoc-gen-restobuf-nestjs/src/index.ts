import {
    createEcmaScriptPlugin,
    safeIdentifier,
    type Schema,
} from "@bufbuild/protoplugin";
import {findHttpRule, HttpRuleExt} from "./http_rule.js";
import {safeObjectProperty} from "@bufbuild/protobuf/reflect";

function extractPathVars(httpRule: HttpRuleExt): {
    path: string;
    pathParams: { pathParam: string; fieldPath: string[] }[]
} {
    const pathTemplate = httpRule.pathTemplate();
    let path = "";
    const pathParams: { pathParam: string; fieldPath: string[] }[] = [];
    for (const httpRuleElement of pathTemplate.segments) {
        if (httpRuleElement.variable == null) {
            path += "/" + httpRuleElement.value;
        } else {
            let pathParam = safeIdentifier(httpRuleElement.variable.fieldPath.join("_"));
            path += `/:${pathParam}`;
            pathParams.push({pathParam, fieldPath: httpRuleElement.variable.fieldPath});
        }
    }
    return {path, pathParams};
}

function extractMethodDecorator(httpRule: HttpRuleExt): string {
    const atMethod = {
        "GET": "Get",
        "POST": "Post",
        "PUT": "Put",
        "PATCH": "Patch",
        "DELETE": "Delete",
    }[httpRule.method()];
    if (atMethod == null) {
        throw new Error("unsupported http method: " + httpRule.method());
    }
    return atMethod;
}

export const protocGenRestobufNestjs = createEcmaScriptPlugin({
    name: "protoc-gen-restobuf-nestjs",
    version: "v1",
    generateTs(schema: Schema) {
        // Loop through all Protobuf files in the schema
        for (const file of schema.files) {
            for (const service of file.services) {
                // Generate a file for each Protobuf file
                {
                    const f = schema.generateFile(`${file.name}/${service.name}_rb.service.ts`);
                    f.preamble(service.file);
                    f.print("@", f.import("Injectable", "@nestjs/common"), "() ");
                    f.print(f.export("abstract class", safeIdentifier(service.name + "Service")), " {");
                    for (const method of service.methods) {
                        const methodName = safeIdentifier("handle" + method.name);
                        f.print("  abstract ", methodName, "(input: ", f.importShape(method.input),
                            ", req: ", f.import("Request", "express"),
                            ", res: ", f.import("Response", "express"),
                            "): Promise<", f.importShape(method.output), ">;");
                    }
                    f.print("}");
                }
                {
                    const f = schema.generateFile(`${file.name}/${service.name}_rb.controller.ts`);
                    f.preamble(service.file);
                    const {fromJson, toJson, JsonValue, JsonObject} = f.runtime;

                    f.print("@", f.import("Controller", "@nestjs/common"), "() ");
                    f.print(f.export("class", safeIdentifier(service.name + "Controller")), " {");
                    {
                        const serviceClass = f.import(safeIdentifier(service.name + "Service"), `./${file.name}/${service.name}_rb.service`);
                        f.print("  constructor(private service: ", serviceClass, ") {}");
                        f.print("");
                    }
                    for (const method of service.methods) {
                        const httpRule = findHttpRule(method);
                        if (httpRule == null) {
                            throw new Error("http custom option is required for rpc method: " + method.name);
                        }
                        let {path, pathParams} = extractPathVars(httpRule);
                        const atMethod = extractMethodDecorator(httpRule);

                        const inputSchema = f.importSchema(method.input);
                        const outputSchema = f.importSchema(method.output);
                        const methodName = safeIdentifier("handle" + method.name);
                        f.print("  @", f.import(atMethod, "@nestjs/common"), "(", "'", path, "')");
                        f.print("  async ", methodName, "(",);
                        f.print("    @", f.import("Param", "@nestjs/common"), "() pathParams: {[key: string]: string},");
                        f.print("    @", f.import("Query", "@nestjs/common"), "() queryParams: {[key: string]: string},");
                        f.print("    @", f.import("Body", "@nestjs/common"), "() body: ", JsonObject, ",");
                        f.print("    @", f.import("Req", "@nestjs/common"), "() req: ", f.import("Request", "express"), ",");
                        f.print("    @", f.import("Res", "@nestjs/common"), "({ passthrough: true}) res: ", f.import("Response", "express"), ",");
                        f.print("  ): Promise<", JsonObject, "> {");
                        f.print("      body ??= {};");
                        f.print("    for (const key in queryParams) {");
                        f.print("      setMessageField(body, key.split('.'), queryParams[key]);");
                        f.print("    }");
                        for (const {pathParam, fieldPath} of pathParams) {
                            f.print("    setMessageField(body, [", fieldPath.map((s) => `"${s}"`), "], pathParams['", pathParam, "']);");
                        }
                        f.print("    const input = ", fromJson, "(", inputSchema, ", body);");
                        f.print("    const output = await this.service.", safeObjectProperty("handle" + method.name), "(input, req, res);");
                        f.print("    return ", toJson, "(", outputSchema, ", output)", ";");
                        f.print("  }");
                        f.print("");
                    }
                    f.print("}");
                    f.print("");

                    f.print(`function setMessageField(message: `, JsonObject, `, fieldPath: string[], value: string): `, JsonValue, ` {
    if(fieldPath.length === 0) {
        throw new Error("fieldPath must not be empty");
    }
    const [field, ...rest] = fieldPath;
    if (fieldPath.length === 1) {
        message[field] = value;
        return message;
    }else {
        message[field] ??= {};
        return setMessageField(message[field] as `, JsonObject, ` , rest, value);
    }
}`);
                }
            }
        }
    },
});
