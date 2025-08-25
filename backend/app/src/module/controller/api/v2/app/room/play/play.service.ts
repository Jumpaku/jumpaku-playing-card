import { Injectable } from '@nestjs/common';
import { PlayServiceService } from '../../../../../../../gen/pb/api/v2/app/room/play/service/PlayService_rb.service';
import {
  AddPlaceRequest,
  AddPlaceResponse,
  ListPlaceRequest,
  ListPlaceResponse,
  MoveCardRequest,
  MoveCardResponse,
  ShuffleRequest,
  ShuffleResponse,
} from '../../../../../../../gen/pb/api/v2/app/room/play/service_pb';
import e from 'express';

@Injectable()
export class PlayService extends PlayServiceService {
  constructor() {
    super();
  }

  handleAddPlace(
    input: AddPlaceRequest,
    req: e.Request,
    res: e.Response,
  ): Promise<AddPlaceResponse> {
    return Promise.resolve(undefined);
  }

  handleListPlace(
    input: ListPlaceRequest,
    req: e.Request,
    res: e.Response,
  ): Promise<ListPlaceResponse> {
    return Promise.resolve(undefined);
  }

  handleMoveCard(
    input: MoveCardRequest,
    req: e.Request,
    res: e.Response,
  ): Promise<MoveCardResponse> {
    return Promise.resolve(undefined);
  }

  handleShuffle(
    input: ShuffleRequest,
    req: e.Request,
    res: e.Response,
  ): Promise<ShuffleResponse> {
    return Promise.resolve(undefined);
  }
}
