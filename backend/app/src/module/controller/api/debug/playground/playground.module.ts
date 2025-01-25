import {Module} from '@nestjs/common';
import {PlaygroundService} from "./playground.service";
import {PlaygroundController} from "./playground.controller";
import {GlobalModule} from "../../../../global/global.module";

@Module({
    imports: [GlobalModule],
    controllers: [PlaygroundController],
    providers: [PlaygroundService],
})
export class PlaygroundModule {
}
