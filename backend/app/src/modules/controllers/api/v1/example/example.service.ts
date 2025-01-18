import {ExampleServiceService as ExampleServiceServiceBase} from "../../../../../gen/pb/api/v1/example/example/ExampleService_rb.service";
import {
    CreateExampleRequest,
    CreateExampleResponse,
    CreateExampleResponseSchema,
    DeleteExampleRequest,
    DeleteExampleResponse,
    DeleteExampleResponseSchema,
    GetExampleRequest,
    GetExampleResponse,
    GetExampleResponseSchema,
    ListExampleRequest,
    ListExampleResponse,
    ListExampleResponseSchema,
    UpdateExampleRequest,
    UpdateExampleResponse,
    UpdateExampleResponseSchema
} from "../../../../../gen/pb/api/v1/example/example_pb";
import e from "express";
import {create} from "@bufbuild/protobuf";

export class ExampleServiceService extends ExampleServiceServiceBase {
    async handleCreateExample(input: CreateExampleRequest, req: e.Request, res: e.Response): Promise<CreateExampleResponse> {
        return create(CreateExampleResponseSchema, {});
    }

    async handleDeleteExample(input: DeleteExampleRequest, req: e.Request, res: e.Response): Promise<DeleteExampleResponse> {
        return create(DeleteExampleResponseSchema, {});
    }

    async handleGetExample(input: GetExampleRequest, req: e.Request, res: e.Response): Promise<GetExampleResponse> {
        return create(GetExampleResponseSchema, {});
    }

    async handleListExample(input: ListExampleRequest, req: e.Request, res: e.Response): Promise<ListExampleResponse> {
        return create(ListExampleResponseSchema, {});
    }

    async handleUpdateExample(input: UpdateExampleRequest, req: e.Request, res: e.Response): Promise<UpdateExampleResponse> {
        return create(UpdateExampleResponseSchema, {});
    }

}
