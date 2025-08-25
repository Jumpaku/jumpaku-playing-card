import { Injectable } from '@nestjs/common';
import { UserServiceService } from '../../../../../../gen/pb/api/v2/app/user/service/UserService_rb.service';
import e from 'express';
import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserRequest,
  GetUserResponse,
} from '../../../../../../gen/pb/api/v2/app/user/service_pb';

@Injectable()
export class UserService extends UserServiceService {
  constructor() {
    super();
  }

  handleCreateUser(
    input: CreateUserRequest,
    req: e.Request,
    res: e.Response,
  ): Promise<CreateUserResponse> {
    return Promise.resolve(undefined);
  }

  handleGetUser(
    input: GetUserRequest,
    req: e.Request,
    res: e.Response,
  ): Promise<GetUserResponse> {
    return Promise.resolve(undefined);
  }
}
