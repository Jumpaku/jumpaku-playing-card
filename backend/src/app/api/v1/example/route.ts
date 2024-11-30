import {NextRequest, NextResponse} from "next/server";
import {create, fromJsonString, toJson} from "@bufbuild/protobuf";
import {
    CreateExampleRequestSchema, CreateExampleResponseSchema,
    ListExampleRequestSchema, ListExampleResponseSchema
} from "@/gen/protobuf/api/v1/example/example_pb";
import {ExampleUsecase} from "@/app/api/v1/example/usecase";


export async function GET(req: NextRequest): Promise<NextResponse> {
    const url = req.nextUrl;
    const input = create(ListExampleRequestSchema, {
        limit: BigInt(url.searchParams.get("limit") ?? 10),
        offset: BigInt(url.searchParams.get("limit") ?? 10),
        desc: url.searchParams.get("desc") === "true",
    });
    const output = new ExampleUsecase().listExample(input);
    return NextResponse.json(toJson(ListExampleResponseSchema, output));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    const input = fromJsonString(CreateExampleRequestSchema, await req.text());
    const output = new ExampleUsecase().createExample(input);
    return NextResponse.json(toJson(CreateExampleResponseSchema, output));
}