import {Module} from '@nestjs/common';
import {ExampleModule} from "./controllers/api/v1/example/example.module";
import {PlaygroundModule} from "./controllers/api/debug/playground/playground.module";

@Module({
    imports: [
        PlaygroundModule,
        ExampleModule,
    ],
})
export class AppModule {
}
