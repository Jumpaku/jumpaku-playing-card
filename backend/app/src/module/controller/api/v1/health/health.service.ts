import {Request, Response} from "express";
import {Injectable} from "@nestjs/common";
import {PostgresProvider} from "../../../../global/postgres.provider";
import {HealthServiceService} from "../../../../../gen/pb/api/v1/health/service/HealthService_rb.service";
import {CheckRequest, CheckResponse, CheckResponseSchema} from "../../../../../gen/pb/api/v1/health/service_pb";
import {create} from "@bufbuild/protobuf";

@Injectable()
export class HealthService extends HealthServiceService {
    constructor(
        private readonly postgres: PostgresProvider
    ) {
        super();
    }

    handleCheck(input: CheckRequest, req: Request, res: Response): Promise<CheckResponse> {
        return this.postgres.transaction(async (tx) => {
            await tx.query("SELECT 1", []);
            return create(CheckResponseSchema);
        });
    }
}
