import e from "express";
import {Controller, Get, Post, Req, Res} from "@nestjs/common";
import {PlaygroundService} from "./playground.service";

@Controller()
export class PlaygroundController {

    constructor(private service: PlaygroundService) {
    }

    @Get("api/debug/playground")
    async playground(@Req() req: e.Request, @Res({passthrough: true}) res: e.Response): Promise<any> {
        return this.service.playground(req, res);
    }
}
