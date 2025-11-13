import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptors';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { EtcdService } from './common/services/etcd.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const etcdService = app.get(EtcdService);
  const port = parseInt(process.env.PORT || '3001', 10);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Notification User Service')
    .setDescription('API docs for the user management microservice')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await etcdService.registerService(
    'user-service',
    'user-service-001',
    'user-service',
    port,
  );

  // Graceful shutdown
  process.on('SIGTERM', () => {
    (async () => {
      await etcdService.deregisterService('user-service', 'user-service-001');
      await app.close();
    })();
  });

  await app.listen(port);
  console.log(`User Service running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
}
bootstrap();
