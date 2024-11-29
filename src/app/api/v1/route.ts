import {NextRequest, NextResponse} from 'next/server';
import {fromJson, toJson} from "@bufbuild/protobuf";
import {UserSchema} from "@/gen/protobuf/example_pb";

export async function GET(req: NextRequest): Promise<NextResponse> {
    console.log(req);
    const body = fromJson(UserSchema, {
        firstName: "John",
    });

    return NextResponse.json(toJson(UserSchema, body));
}