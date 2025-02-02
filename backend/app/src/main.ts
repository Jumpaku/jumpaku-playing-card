import {NestFactory} from '@nestjs/core';
import {AppModule} from './module/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    //app.useGlobalInterceptors(new LoggingInterceptor(new LoggerProvider()));
    //app.useGlobalFilters(new AppExceptionFilter(new LoggerProvider()));

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
