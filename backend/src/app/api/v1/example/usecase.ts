import {
    CreateExampleRequest,
    CreateExampleResponse, CreateExampleResponseSchema,
    DeleteExampleRequest,
    DeleteExampleResponse, DeleteExampleResponseSchema,
    ExampleSchema,
    GetExampleRequest,
    GetExampleResponse, GetExampleResponseSchema,
    ListExampleRequest,
    ListExampleResponse,
    ListExampleResponseSchema,
    UpdateExampleRequest,
    UpdateExampleResponse, UpdateExampleResponseSchema
} from "@/gen/protobuf/api/v1/example/example_pb";
import {create} from "@bufbuild/protobuf";

export class ExampleUsecase {
    listExample(req: ListExampleRequest): ListExampleResponse {
        console.log(req);
        return create(ListExampleResponseSchema, {
            exampleList: [
                create(ExampleSchema, {
                    exampleId: "1",
                    exampleName: "example1",
                    exampleContent: "example1",
                }),
            ],
        })
    }

    createExample(req: CreateExampleRequest): CreateExampleResponse {
        console.log(req);
        return create(CreateExampleResponseSchema, {
            example: create(ExampleSchema, {
                exampleId: "1",
                exampleName: "example1",
                exampleContent: "example1",
            }),
        });
    }

    updateExample(req: UpdateExampleRequest): UpdateExampleResponse {
        console.log(req);
        return create(UpdateExampleResponseSchema, {
            example: create(ExampleSchema, {
                exampleId: "1",
                exampleName: "example1",
                exampleContent: "example1",
            }),
        });
    }

    deleteExample(req: DeleteExampleRequest): DeleteExampleResponse {
        console.log(req);
        return create(DeleteExampleResponseSchema, {});
    }

    getExample(req: GetExampleRequest): GetExampleResponse {
        console.log(req);
        return create(GetExampleResponseSchema, {
            example: create(ExampleSchema, {
                exampleId: "1",
                exampleName: "example1",
                exampleContent: "example1",
            }),
        });
    }

}