import {NextRequest, NextResponse} from "next/server";
import {create, fromJsonString, toJson} from "@bufbuild/protobuf";
import {
    DeleteExampleRequestSchema, DeleteExampleResponseSchema,
    GetExampleRequestSchema,
    GetExampleResponseSchema,
    UpdateExampleRequestSchema,
    UpdateExampleResponseSchema,
} from "@/gen/protobuf/api/v1/example/example_pb";
import {ExampleUsecase} from "@/app/api/v1/example/usecase";

export async function GET(req: NextRequest, {params}: {
    params: Promise<{ example_id: string }>
}): Promise<NextResponse> {
    const {example_id: exampleId} = await params;
    const input = create(GetExampleRequestSchema, {exampleId});
    const output = new ExampleUsecase().getExample(input);
    return NextResponse.json(toJson(GetExampleResponseSchema, output));
}

export async function PUT(req: NextRequest, {params}: {
    params: Promise<{ example_id: string }>
}): Promise<NextResponse> {
    const {example_id: exampleId} = await params;
    const input = fromJsonString(UpdateExampleRequestSchema, await req.text());
    input.exampleId = exampleId;
    const output = new ExampleUsecase().updateExample(input);
    return NextResponse.json(toJson(UpdateExampleResponseSchema, output));
}

export async function DELETE(req: NextRequest, {params}: {
    params: Promise<{ example_id: string }>
}): Promise<NextResponse> {
    const {example_id: exampleId} = await params;
    const input = create(DeleteExampleRequestSchema, {exampleId});
    const output = new ExampleUsecase().deleteExample(input);
    return NextResponse.json(toJson(DeleteExampleResponseSchema, output));
}