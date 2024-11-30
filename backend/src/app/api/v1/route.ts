import {NextRequest, NextResponse} from 'next/server';
import {create, toJson} from "@bufbuild/protobuf";
import {UserSchema} from "@/gen/protobuf/api/v1/example_pb";

export async function GET(req: NextRequest): Promise<NextResponse> {
    console.log(req);
    const body = create(UserSchema, {
        firstName: "John",
    });

    return NextResponse.json(toJson(UserSchema, body));
}