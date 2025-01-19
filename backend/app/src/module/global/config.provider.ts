import {Injectable} from "@nestjs/common";
import {AppConfig, AppConfigSchema} from "../../gen/pb/config/config_pb";
import {clone, create, JsonObject} from "@bufbuild/protobuf";
import {overwriteConfigWithEnv, overwriteConfigWithJson} from "../../lib/config";
import * as fs from "node:fs";
import * as process from "node:process";

@Injectable()
export class ConfigProvider {

    static load(configPath?: string): ConfigProvider {
        const config = new ConfigProvider(create(AppConfigSchema));
        if (configPath != null) {
            config.reload(configPath);
        }
        return config;
    }

    constructor(private config: AppConfig) {
    }

    get(): AppConfig {
        return clone(AppConfigSchema, this.config);
    }

    reload(configPath?: string) {
        if (configPath != null) {
            const configJson = fs.readFileSync(configPath, "utf-8");
            this.config = overwriteConfigWithJson(AppConfigSchema, create(AppConfigSchema), JSON.parse(configJson) as JsonObject);
        }
        this.config = overwriteConfigWithEnv(AppConfigSchema, this.config, process.env);
    }
}
