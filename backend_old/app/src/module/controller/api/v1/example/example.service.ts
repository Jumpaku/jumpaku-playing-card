import {
    ExampleServiceService as ExampleServiceServiceBase
} from "../../../../../gen/pb/api/v1/example/example/ExampleService_rb.service";
import {
    CreateExampleRequest,
    CreateExampleResponse,
    CreateExampleResponseSchema,
    DeleteExampleRequest,
    DeleteExampleResponse,
    DeleteExampleResponseSchema, ExampleSchema,
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
import {RandomProvider} from "../../../../global/random.provider";
import {PostgresProvider, selectAll} from "../../../../global/postgres.provider";
import {Example$} from "../../../../../gen/pg/dao/dao_Example";
import {RequestTimeProvider} from "../../../../global/request_time.provider";
import {Injectable} from "@nestjs/common";

@Injectable()
export class ExampleServiceService extends ExampleServiceServiceBase {
    constructor(
        private readonly random: RandomProvider,
        private readonly postgres: PostgresProvider,
        private readonly requestTime: RequestTimeProvider,
    ) {
        super();
    }

    async handleCreateExample(input: CreateExampleRequest, req: e.Request, res: e.Response): Promise<CreateExampleResponse> {
        const exampleId = this.random.uuid();
        const now = this.requestTime.extract(req);
        const example = {
            exampleId: exampleId,
            exampleName: input.exampleName,
            exampleContent: input.exampleContent,
        }
        await this.postgres.transaction(async (tx) => {
            await Example$.insert(tx, {
                example_id: example.exampleId,
                name: example.exampleName,
                content: example.exampleContent,
                create_time: now,
                update_time: now,
            });
        });
        return create(CreateExampleResponseSchema, {
            example: create(ExampleSchema, example),
        });
    }

    async handleDeleteExample(input: DeleteExampleRequest, req: e.Request, res: e.Response): Promise<DeleteExampleResponse> {
        await this.postgres.transaction(async (tx) => {
            await Example$.delete(tx, {
                example_id: input.exampleId,
            });
        });
        return create(DeleteExampleResponseSchema, {});
    }

    async handleGetExample(input: GetExampleRequest, req: e.Request, res: e.Response): Promise<GetExampleResponse> {
        let example: Example$ | null | undefined;
        await this.postgres.transaction(async (tx) => {
            example = await Example$.find(tx, {
                example_id: input.exampleId,
            });
        });
        if (example == null) {
            throw new Error("example not found");
        }

        return create(GetExampleResponseSchema, {
            example: create(ExampleSchema, {
                exampleId: example.example_id,
                exampleName: example.name,
                exampleContent: example.content,
            }),
        });
    }

    async handleListExample(input: ListExampleRequest, req: e.Request, res: e.Response): Promise<ListExampleResponse> {
        let exampleList: Example$[] | undefined;
        await this.postgres.transaction(async (tx) => {
            exampleList = await selectAll<Example$>(tx,
                `SELECT *
                 FROM "Example"
                 LIMIT $1 OFFSET $2`, [Number(input.limit ?? 0), Number(input.offset ?? 0)]);
        });

        return create(ListExampleResponseSchema, {
            exampleList: (exampleList ?? []).map((e) => create(ExampleSchema, {
                exampleId: e.example_id,
                exampleName: e.name,
                exampleContent: e.content,
            }))
        });
    }

    async handleUpdateExample(input: UpdateExampleRequest, req: e.Request, res: e.Response): Promise<UpdateExampleResponse> {
        const now = this.requestTime.extract(req);
        let example :Example$|undefined;
        await this.postgres.transaction(async (tx) => {
            const found = await Example$.find(tx, {
                example_id: input.exampleId,
            });
            if (found == null) {
                throw new Error("example not found");
            }
            if(input.setExampleName){
                found.name = input.exampleName;
            }
            if(input.setExampleContent){
                found.content = input.exampleContent;
            }
            found.update_time = now;
            await Example$.update(tx, found);
            example = found;
        });
        return create(UpdateExampleResponseSchema, {
            example: create(ExampleSchema, {
                exampleId: example!.example_id,
                exampleName: example!.name,
                exampleContent: example!.content,
            }),
        });
    }

}
