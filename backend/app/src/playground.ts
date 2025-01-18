import {fromJson} from "@bufbuild/protobuf";
import {ArrSchema, ExampleSchema} from "./gen/pb/api/v1/example/example_pb";

const x = {d:"1.3",i:"4"};

const y = fromJson(ArrSchema, x);

console.log(JSON.stringify(y));
