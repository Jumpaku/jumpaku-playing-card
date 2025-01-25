import {Module} from '@nestjs/common';
import {ExampleServiceController} from "../../../../../gen/pb/api/v1/example/example/ExampleService_rb.controller";
import {
    ExampleServiceService as ExampleServiceServiceToken
} from "../../../../../gen/pb/api/v1/example/example/ExampleService_rb.service";
import {ExampleServiceService} from "./example.service";

@Module({
    controllers: [ExampleServiceController],
    providers: [{
        provide: ExampleServiceServiceToken,
        useClass: ExampleServiceService,
    }],
})
export class ExampleModule {
}
