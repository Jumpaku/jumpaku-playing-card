import e from "express";
import {RandomProviderToken} from "../../../../global/random.provider";
import {Inject} from "@nestjs/common";
import {RequestIdProvider} from "../../../../global/request_id.provider";
import {RequestTimeProviderToken} from "../../../../global/request_time.provider";
import {ConfigProvider} from "../../../../global/config.provider";
import {toJson} from "@bufbuild/protobuf";
import {AppConfigSchema} from "../../../../../gen/pb/config/config_pb";
import {LoggerProvider} from "../../../../global/logger.provider";
import {PostgresProvider, selectAll} from "../../../../global/postgres.provider";

export class PlaygroundService {
    @Inject() private logger: LoggerProvider;
    @Inject() private config: ConfigProvider;
    @Inject() private random: RandomProviderToken;
    @Inject() private requestId: RequestIdProvider;
    @Inject() private requestTime: RequestTimeProviderToken;
    @Inject() private postgres: PostgresProvider;

    async playground(req: e.Request, res: e.Response): Promise<any> {

        this.config.reload('config/local.json');

        this.logger.debug("playground debug log");
        this.logger.log("playground log log");
        this.logger.warn("playground warn log");
        this.logger.error("playground error log");

        await this.postgres.transaction(async (tx) => {
            console.log(await selectAll(tx, "SELECT $1 as t", [new Date(Date.now())]));
            console.log(await selectAll(tx, "SELECT TIMESTAMPTZ '2024-01-01T00:11:22+09:00' as t", []));
        });

        return {
            config: toJson(AppConfigSchema, this.config.get()),
            random: this.random.int32(10),
            requestId: this.requestId.requestId(),
            requestTime: this.requestTime.requestTime(""),
            message: "Hello, playground!",
        };
    }
}
