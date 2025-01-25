import {Module} from '@nestjs/common';
import {ExampleModule} from "./controller/api/v1/example/example.module";
import {PlaygroundModule} from "./controller/api/debug/playground/playground.module";

@Module({
    imports: [
        PlaygroundModule,
        ExampleModule,
    ],
})
export class AppModule {
}
