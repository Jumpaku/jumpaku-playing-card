import { Injectable } from '@nestjs/common';
import { AppConfig, AppConfigSchema } from '../../gen/pb/config/config_pb';
import { clone, create, fromJson, JsonObject } from '@bufbuild/protobuf';
import * as fs from 'node:fs';

@Injectable()
export class ConfigProvider {
  static load(configPath?: string): ConfigProvider {
    const config = new ConfigProvider(create(AppConfigSchema));
    if (configPath != null) {
      config.reload(configPath);
    }

    return config;
  }

  constructor(private config: AppConfig) {}

  get(): AppConfig {
    return clone(AppConfigSchema, this.config);
  }

  reload(configPath?: string) {
    if (configPath != null) {
      const configJson = fs.readFileSync(configPath, 'utf-8');
      this.config = fromJson(
        AppConfigSchema,
        JSON.parse(configJson) as JsonObject,
      );
    }
  }
}
