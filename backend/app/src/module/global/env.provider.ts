import { Injectable } from '@nestjs/common';
import {
  AppConfigSchema,
  AppEnv,
  AppEnvSchema,
} from '../../gen/pb/config/config_pb';
import { clone, create, fromJson, JsonObject } from '@bufbuild/protobuf';
import * as process from 'node:process';
import { FieldDescriptorProto_Type } from '@bufbuild/protobuf/wkt';

@Injectable()
export class EnvProvider {
  static load(): EnvProvider {
    const env = new EnvProvider(create(AppEnvSchema));
    env.reload();
    return env;
  }

  constructor(private env: AppEnv) {}

  get(): AppEnv {
    return clone(AppEnvSchema, this.env);
  }

  reload() {
    const env: JsonObject = {};
    AppConfigSchema.fields.forEach((field) => {
      const val = process.env[field.name.toUpperCase()];
      switch (field.proto.type) {
        case FieldDescriptorProto_Type.BOOL: {
          env[field.jsonName] = ['1', 't', 'true'].includes(
            val?.toLowerCase() ?? 'false',
          );
          break;
        }
        case FieldDescriptorProto_Type.INT64: {
          env[field.jsonName] = Number.parseInt(val ?? '0', 10);
          break;
        }
        case FieldDescriptorProto_Type.DOUBLE: {
          env[field.jsonName] = Number.parseFloat(val ?? '0');
          break;
        }
        case FieldDescriptorProto_Type.STRING:
        case FieldDescriptorProto_Type.ENUM: {
          env[field.jsonName] = val ?? '';
          break;
        }
        case FieldDescriptorProto_Type.MESSAGE: {
          switch (field.proto.typeName) {
            case 'google.protobuf.BoolValue': {
              env[field.jsonName] = ['1', 't', 'true'].includes(
                val?.toLowerCase() ?? 'false',
              );
              break;
            }
            case 'google.protobuf.Int64Value': {
              env[field.jsonName] = Number.parseInt(val ?? '0', 10);
              break;
            }
            case 'google.protobuf.DoubleValue': {
              env[field.jsonName] = Number.parseFloat(val ?? '0');
              break;
            }
            case 'google.protobuf.StringValue': {
              env[field.jsonName] = val ?? '';
              break;
            }
            case 'google.protobuf.Timestamp': {
              env[field.jsonName] = val ?? '';
              break;
            }
          }
        }
      }
    });
    this.env = fromJson(AppEnvSchema, env);
  }
}
