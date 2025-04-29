import {Module} from '@nestjs/common';
import {HealthServiceController} from "../../../../../gen/pb/api/v1/health/service/HealthService_rb.controller";
import {HealthServiceService} from "../../../../../gen/pb/api/v1/health/service/HealthService_rb.service";
import {HealthService} from "./health.service";

@Module({
    controllers: [HealthServiceController],
    providers: [
        {
            provide: HealthServiceService,
            useClass: HealthService,
        },
    ],
    imports: [],
})
export class HealthModule {
}
