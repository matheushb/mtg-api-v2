import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export default function appConfig(app: INestApplication<any>) {
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'deck_import_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: 'deck_updates_queue',
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });
}
