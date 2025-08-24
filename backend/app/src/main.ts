import {NestFactory} from '@nestjs/core';
import {AppModule} from './module/app.module';
import {mustGetEnv} from "./lib/env";

const options = {
    port: mustGetEnv("PORT"),
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    await app.listen(options.port);
}

bootstrap();
