import {create} from "@bufbuild/protobuf";
import {ExampleSchema} from "./gen/pb/api/v1/example/example_pb";

export function panic(message: string): never {
    throw new Error(message);
}

export function assertTrue(expectTrue: boolean, message: string): asserts expectTrue is true {
    if (!expectTrue) {
        throw new Error(message);
    }
    return;
}
