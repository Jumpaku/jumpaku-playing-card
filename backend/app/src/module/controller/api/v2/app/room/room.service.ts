import { Injectable } from '@nestjs/common';
import { RoomServiceService } from '../../../../../../gen/pb/api/v2/app/room/service/RoomService_rb.service';
import {
  CreateRoomRequest,
  CreateRoomResponse,
  EnterRoomRequest,
  EnterRoomResponse,
  ExitRoomRequest,
  ExitRoomResponse,
  GetRoomRequest,
  GetRoomResponse,
  ResetRoomRequest,
  ResetRoomResponse,
} from '../../../../../../gen/pb/api/v2/app/room/service_pb';
import e from 'express';

@Injectable()
export class RoomService extends RoomServiceService {
  constructor() {
    super();
  }

  handleCreateRoom(
    input: CreateRoomRequest,
    req: e.Request,
    res: e.Response,
  ): Promise<CreateRoomResponse> {
    return Promise.resolve(undefined);
  }

  handleEnterRoom(
    input: EnterRoomRequest,
    req: e.Request,
    res: e.Response,
  ): Promise<EnterRoomResponse> {
    return Promise.resolve(undefined);
  }

  handleExitRoom(
    input: ExitRoomRequest,
    req: e.Request,
    res: e.Response,
  ): Promise<ExitRoomResponse> {
    return Promise.resolve(undefined);
  }

  handleGetRoom(
    input: GetRoomRequest,
    req: e.Request,
    res: e.Response,
  ): Promise<GetRoomResponse> {
    return Promise.resolve(undefined);
  }

  handleResetRoom(
    input: ResetRoomRequest,
    req: e.Request,
    res: e.Response,
  ): Promise<ResetRoomResponse> {
    return Promise.resolve(undefined);
  }
}
