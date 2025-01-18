// @generated by protoc-gen-restobuf-nestjs v1 with parameter "target=ts,import_extension=js"
// @generated from file api/v1/example.proto (package api.v1, syntax proto3)
/* eslint-disable */

import { Injectable } from "@nestjs/common";
import type { CreateExampleRequest, CreateExampleResponse, DeleteExampleRequest, DeleteExampleResponse, GetExampleRequest, GetExampleResponse, ListExampleRequest, ListExampleResponse, UpdateExampleRequest, UpdateExampleResponse } from "../example_pb.js";
import { Request, Response } from "express";

@Injectable() 
export abstract class ExampleServiceService {
  abstract handleListExample(input: ListExampleRequest, req: Request, res: Response): Promise<ListExampleResponse>;
  abstract handleGetExample(input: GetExampleRequest, req: Request, res: Response): Promise<GetExampleResponse>;
  abstract handleUpdateExample(input: UpdateExampleRequest, req: Request, res: Response): Promise<UpdateExampleResponse>;
  abstract handleCreateExample(input: CreateExampleRequest, req: Request, res: Response): Promise<CreateExampleResponse>;
  abstract handleDeleteExample(input: DeleteExampleRequest, req: Request, res: Response): Promise<DeleteExampleResponse>;
}
