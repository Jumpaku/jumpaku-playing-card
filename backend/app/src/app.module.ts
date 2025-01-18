import {Module} from '@nestjs/common';
import {ExampleModule} from "./modules/controllers/api/v1/example/example.module";

@Module({
    imports: [
        ExampleModule,
    ],
})
export class AppModule {}
